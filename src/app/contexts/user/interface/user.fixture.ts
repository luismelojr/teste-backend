import FixtureBuilderContainer
  from 'shared/test-helpers/fixture-builder-container';
import FixtureHelper from 'shared/test-helpers/fixture-helper';
import { UserRoleType } from 'enumerates/user-role-type';
import UserEntityBuilder from '../infrastructure/user.entity.builder';

const fbc = new FixtureBuilderContainer();
const secret =
  'e9c0fbabe00490ec959744f093cb876a$42ddc1efbc7c0fe86681195f5f6a92f395d5e56d54239ee57c87721c98b9be16d0169dcf14db1cf129068b1bd3954468f3c62c8c0ac2c2fd8b9f01ba40400a0d';

export const fakeData: any = {
  person: {
    name: 'Tony Stark',
    cpf: '18193863097',
    email: 'tony_stark@email.com.br',
    gender: 'MALE',
  },
  user: {
    name: 'Tony Stark',
    cpf: '18193863097',
    email: 'tony_stark@email.com.br',
    role: UserRoleType.ADMIN,
    password: secret,
  },
};

const fixtures = [
  new UserEntityBuilder(fbc).with(fakeData.person).mergeOnBuild(fakeData, 'person'),
].map((f) => f.build());

export const loadFixtures = async (dataSource): Promise<void> =>
  await new FixtureHelper().loadFixtures({
    fixtures: [...fixtures],
    dataSource,
  });
