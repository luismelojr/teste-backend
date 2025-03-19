import { removeUndefined } from '../helpers/remove-undefined';

export class FixtureBuilder {
  public object: any;
  public callbacks: any[];
  public fixtureContainer: any;

  constructor(fixtureContainer: any = undefined) {
    this.object = {};
    this.callbacks = [];
    this.fixtureContainer = fixtureContainer;
  }

  build(): any {
    this.callbacks.forEach((callback) => callback(this.object.data));
    return removeUndefined(this.object);
  }

  onBuild(callback): this {
    this.callbacks.push(callback);
    return this;
  }

  /**
   * Use this method when you want to merge
   * the generated object data into an external object target.
   *
   * const targetObject = {};
   * new NodeBuilder(builderContainer)
   *  .mergeOnBuild(targetObject, 'targetKey'),
   */

  mergeOnBuild(target, property): this {
    return this.onBuild((data) => {
      target[property] = { ...data, ...target[property] };
    });
  }

  /**
   * Use this method when you want to merge
   * with fixed data. Example:
   *
   * new NodeBuilder(builderContainer)
   *  .with({ name: 'example' }),
   */

  with(data): this {
    this.object = { ...this.object, data: { ...this.object.data, ...data } };
    return this;
  }

  /**
   * Use this method when you want to merge
   * with data from a previous builder.
   * Example:
   *
   * const state = {};
   * new NodeBuilder(builderContainer)
   *  .mergeOnBuild(state, 'node1'),
   *
   * new NodeBuilder(builderContainer)
   *  .withAsync(() => ({ parentId: state.node1.id ) }))
   */

  withAsync(getCreator): this {
    return this.onBuild(() => {
      const data = getCreator();
      this.with(data);
    });
  }

  static many(c, commonData, items): unknown {
    let localItems = items;
    if (items > 0) {
      localItems = [...Array(items)];
    }

    let localCommonData = commonData;
    if (!items && commonData?.length) {
      localItems = commonData;
      localCommonData = {};
    }
    return localItems.map((data) =>
      new this(c).with(localCommonData).with(data),
    );
  }
}
