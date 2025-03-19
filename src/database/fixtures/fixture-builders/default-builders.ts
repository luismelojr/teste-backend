import FixtureBuilderContainer
  from 'shared/test-helpers/fixture-builder-container';
import PersonBuilder from 'person/infrastructure/person.entity.builder';
import UserBuilder from 'user/infrastructure/user.entity.builder';

const fbc = new FixtureBuilderContainer();

export const fakeData: any = {
  person: {
    phone: '999999999',
  },
  user: {
    username: 'patria',
    email: 'renanc.morais+teste@gmail.com',
  },
};

export const defaultBuilders = ({ container }) => {
  return [
    new PersonBuilder(container).with({
      name: 'Renan',
      cpf: '18193863097',
      gender: 'MALE',
    }).mergeOnBuild(fakeData, 'person'),
    new UserBuilder(fbc).with(fakeData.user).withAsync(() => ({
      username: 'patria',
      email: 'renanc.morais+teste@gmail.com',
      person: {
        id: fakeData.person.id,
      },
    })).mergeOnBuild(fakeData, 'user'),

  ];
};
