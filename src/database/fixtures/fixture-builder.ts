import FixtureBuilderContainer from 'shared/test-helpers/fixture-builder-container';
import { defaultBuilders } from './fixture-builders/default-builders';

export const FixtureBuilder = () => {
  const container = new FixtureBuilderContainer();
  const builders = defaultBuilders({ container });
  return builders.map((builder) => builder.build());
};
