export interface GrainConsumerProps {
  isConsumer: boolean;
  isOwnGrain?: boolean;
  isReceiveThirdGrains?: boolean;
  annualQuantity?: number;
}

export class GrainConsumer {
  private readonly _isConsumer: boolean;
  private readonly _isOwnGrain: boolean;
  private readonly _isReceiveThirdGrains: boolean;
  private readonly _annualQuantity: number;

  constructor(props: GrainConsumerProps) {
    this._isConsumer = props.isConsumer|| false;
    this._isOwnGrain = props.isOwnGrain || false;
    this._isReceiveThirdGrains = props.isReceiveThirdGrains || false;
    this._annualQuantity = props.annualQuantity || 0;
  }

  public static create(props: GrainConsumerProps): GrainConsumer {
    if (!props?.isConsumer) {
      return new GrainConsumer({
        isConsumer: false,
        isOwnGrain: false,
        isReceiveThirdGrains: false,
        annualQuantity: 0,
      });
    }
    return new GrainConsumer(props);
  }

  get isConsumer(): boolean {
    return this._isConsumer;
  }

  get isOwnGrain(): boolean {
    return this._isOwnGrain;
  }

  get isReceiveThirdGrains(): boolean {
    return this._isReceiveThirdGrains;
  }

  get annualQuantity(): number {
    return this._annualQuantity;
  }
}
