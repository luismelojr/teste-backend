import { AuthModule } from 'auth/auth.module';
import { PersonModule } from 'person/person.module';
import { CityModule } from 'commons/locations/city/city.module';
import { UserModule } from 'user/user.module';
import { HealthModule } from 'shared/health/health.module';
import { EventTypeModule } from 'event-type/event-type.module';
import { OccupationModule } from 'occupation/occupation.module';
import { PlanModule } from 'plan/plan.module';
import { CropModule } from 'commons/crop/crop.module';
import { CultivationModule } from 'commons/cultivations/cultivation.module';
import { ActivityModule } from 'activity/activity.module';
import { CustomerModule } from 'customer/customer.module';
import { CompanyModule } from 'company/company.module';
import { ContractModule } from 'contract/contract.module';

export const modules = [
  HealthModule,
  AuthModule,
  UserModule,
  PersonModule,
  CityModule,
  EventTypeModule,
  OccupationModule,
  ActivityModule,
  PlanModule,
  CropModule,
  CultivationModule,
  CustomerModule,
  CompanyModule,
  ContractModule,
];
