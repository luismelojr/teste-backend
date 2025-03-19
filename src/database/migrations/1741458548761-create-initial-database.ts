import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialDatabase1741458548761 implements MigrationInterface {
  name = 'CreateInitialDatabase1741458548761';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "states" ("id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "state_code" character varying(2), CONSTRAINT "PK_states_87ea5dfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_states_fe52f024" ON "states" ("name") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_states_291725a0" ON "states" ("state_code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "cities" ("id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "state_id" bigint NOT NULL, CONSTRAINT "PK_cities_87ea5dfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."persons_gender_enum" AS ENUM('MALE', 'FEMALE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "persons" ("id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "cpf" character varying(11), "phone" character varying, "address" character varying, "gender" "public"."persons_gender_enum", "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "city_id" bigint, CONSTRAINT "PK_persons_87ea5dfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "cognito_id" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "person_id" bigint, CONSTRAINT "PK_users_87ea5dfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "occupations" ("id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, CONSTRAINT "PK_occupations_87ea5dfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_types" ("id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, CONSTRAINT "PK_event_types_87ea5dfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."employees_contract_type_enum" AS ENUM('CLT', 'CNPJ', 'Estágio', 'Experiência')`,
    );
    await queryRunner.query(
      `CREATE TABLE "employees" ("id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "business_phone" character varying NOT NULL, "business_email" character varying NOT NULL, "occupation" character varying NOT NULL, "start_date" TIMESTAMP NOT NULL, "contract_type" "public"."employees_contract_type_enum" NOT NULL, "shutdown_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, CONSTRAINT "PK_employees_87ea5dfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "companies" ("id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "trade_name" character varying, "cnpj" character varying(11), "phone" character varying, "address" character varying, "email" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "city_id" bigint, CONSTRAINT "PK_companies_87ea5dfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_companies_703760d0" ON "companies" ("cnpj") `,
    );
    await queryRunner.query(
      `CREATE TABLE "plan_functions" ("id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "plan_id" bigint NOT NULL, CONSTRAINT "PK_plan_functions_87ea5dfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "plans" ("id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, CONSTRAINT "PK_plans_87ea5dfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "activities" ("id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, CONSTRAINT "PK_activities_87ea5dfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "customer_locations" ("id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "address" character varying, "latitude" numeric, "longitude" numeric, "total_hectares" numeric, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "customer_id" bigint NOT NULL, CONSTRAINT "PK_customer_locations_87ea5dfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_customer_locations_677e7fdb" ON "customer_locations" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "customer_persons" ("id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "customer_id" bigint NOT NULL, "person_id" bigint NOT NULL, "occupation_id" bigint NOT NULL, CONSTRAINT "PK_customer_persons_87ea5dfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "customer_activities" ("id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "customer_id" bigint NOT NULL, "activity_id" bigint NOT NULL, CONSTRAINT "PK_customer_activities_87ea5dfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cultivations" ("id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, CONSTRAINT "PK_cultivations_87ea5dfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "customer_crop_information_cultivations" ("id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "cultivation_id" bigint NOT NULL, "customer_crop_information_id" bigint NOT NULL, CONSTRAINT "PK_customer_crop_information_cultivations_87ea5dfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."customer_crop_information_type_crop_enum" AS ENUM('SUMMER', 'SECOND', 'THIRD')`,
    );
    await queryRunner.query(
      `CREATE TABLE "customer_crop_information" ("id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "type_crop" "public"."customer_crop_information_type_crop_enum" NOT NULL DEFAULT 'SUMMER', "planting_season_start" TIMESTAMP, "planting_season_end" TIMESTAMP, "harvest_season_start" TIMESTAMP, "harvest_season_end" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "customer_id" bigint NOT NULL, CONSTRAINT "PK_customer_crop_information_87ea5dfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."crops_type_enum" AS ENUM('SUMMER', 'SECOND', 'THIRD')`,
    );
    await queryRunner.query(
      `CREATE TABLE "crops" ("id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "type" "public"."crops_type_enum" NOT NULL DEFAULT 'SUMMER', "start" integer NOT NULL, "end" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, CONSTRAINT "PK_crops_87ea5dfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."customer_crops_status_enum" AS ENUM('Planted', 'Harvested', 'In Progress')`,
    );
    await queryRunner.query(
      `CREATE TABLE "customer_crops" ("id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "identification" character varying NOT NULL, "status" "public"."customer_crops_status_enum" NOT NULL DEFAULT 'Planted', "description" character varying, "planting_date" TIMESTAMP, "harvest_date" TIMESTAMP, "planted_area_hectares" numeric, "average_productivity" numeric, "conservative_productivity" numeric, "expected_total_production" numeric, "nitrogen_percentage" numeric, "phosphorus_percentage" numeric, "potassium_percentage" numeric, "ammonium_sulfate_percentage" numeric, "defensive_percentage" numeric, "seed_percentage" numeric, "total_sold_bags" numeric, "total_sold_percentage" numeric, "average_sales_value" numeric, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "customer_id" bigint NOT NULL, "cultivation_id" bigint NOT NULL, "crop_id" bigint NOT NULL, CONSTRAINT "PK_customer_crops_87ea5dfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_customer_crops_246d2701" ON "customer_crops" ("identification") `,
    );
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "identifier" character varying NOT NULL, "group_identifier" character varying NOT NULL, "description" character varying, "financial_tools" boolean NOT NULL DEFAULT false, "receives_land_rent" boolean NOT NULL DEFAULT false, "grain_consumer" boolean NOT NULL DEFAULT false, "own_grain" boolean NOT NULL DEFAULT false, "annual_quantity" integer NOT NULL DEFAULT '0', "receive_third_grains" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, CONSTRAINT "PK_customers_87ea5dfc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_customers_cfbf0c41" ON "customers" ("identifier") `,
    );
    await queryRunner.query(
      `CREATE TABLE "customer_crops_locations_customer_locations" ("customer_crops_id" bigint NOT NULL, "customer_locations_id" bigint NOT NULL, CONSTRAINT "PK_customer_crops_locations_customer_locations_2ded711e" PRIMARY KEY ("customer_crops_id", "customer_locations_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_customer_crops_locations_customer_locations_5c502b65" ON "customer_crops_locations_customer_locations" ("customer_crops_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_customer_crops_locations_customer_locations_d2b686a9" ON "customer_crops_locations_customer_locations" ("customer_locations_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "cities" ADD CONSTRAINT "FK_cities_1229b56a" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "persons" ADD CONSTRAINT "FK_persons_44b39ad6" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_users_5ed72dcd" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "companies" ADD CONSTRAINT "FK_companies_6398f263" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_functions" ADD CONSTRAINT "FK_plan_functions_286db996" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_locations" ADD CONSTRAINT "FK_customer_locations_da3b6721" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_persons" ADD CONSTRAINT "FK_customer_persons_ee303cbe" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_persons" ADD CONSTRAINT "FK_customer_persons_d865249f" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_persons" ADD CONSTRAINT "FK_customer_persons_30a5029c" FOREIGN KEY ("occupation_id") REFERENCES "occupations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_activities" ADD CONSTRAINT "FK_customer_activities_77282126" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_activities" ADD CONSTRAINT "FK_customer_activities_0b10469e" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_crop_information_cultivations" ADD CONSTRAINT "FK_customer_crop_information_cultivations_346ca654" FOREIGN KEY ("cultivation_id") REFERENCES "cultivations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_crop_information_cultivations" ADD CONSTRAINT "FK_customer_crop_information_cultivations_20dce789" FOREIGN KEY ("customer_crop_information_id") REFERENCES "customer_crop_information"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_crop_information" ADD CONSTRAINT "FK_customer_crop_information_8a87ad8e" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_crops" ADD CONSTRAINT "FK_customer_crops_34501d1e" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_crops" ADD CONSTRAINT "FK_customer_crops_e3f47714" FOREIGN KEY ("cultivation_id") REFERENCES "cultivations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_crops" ADD CONSTRAINT "FK_customer_crops_a4e8310c" FOREIGN KEY ("crop_id") REFERENCES "crops"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_crops_locations_customer_locations" ADD CONSTRAINT "FK_customer_crops_locations_customer_locations_5c502b65" FOREIGN KEY ("customer_crops_id") REFERENCES "customer_crops"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_crops_locations_customer_locations" ADD CONSTRAINT "FK_customer_crops_locations_customer_locations_d2b686a9" FOREIGN KEY ("customer_locations_id") REFERENCES "customer_locations"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(`ALTER TABLE "contracts"
          ADD CONSTRAINT "FK_contracts_plan_id"
          FOREIGN KEY ("plan_id") REFERENCES "plans"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION`);

    await queryRunner.query(`ALTER TABLE "contracts"
          ADD CONSTRAINT "FK_contracts_company_id"
          FOREIGN KEY ("company_id") REFERENCES "companies"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION`);

    await queryRunner.query(`ALTER TABLE "contracts"
          ADD CONSTRAINT "FK_contracts_person_id"
          FOREIGN KEY ("person_id") REFERENCES "persons"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION`);

    await queryRunner.query(`ALTER TABLE "contracts"
          ADD CONSTRAINT "FK_contracts_customer_id"
          FOREIGN KEY ("customer_id") REFERENCES "customers"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION`);

    // Adicionar check constraint para garantir que pelo menos company_id ou person_id estejam preenchidos
    await queryRunner.query(`ALTER TABLE "contracts"
          ADD CONSTRAINT "CHK_contracts_company_or_person"
          CHECK (("company_id" IS NOT NULL) OR ("person_id" IS NOT NULL))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customer_crops_locations_customer_locations" DROP CONSTRAINT "FK_customer_crops_locations_customer_locations_d2b686a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_crops_locations_customer_locations" DROP CONSTRAINT "FK_customer_crops_locations_customer_locations_5c502b65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_crops" DROP CONSTRAINT "FK_customer_crops_a4e8310c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_crops" DROP CONSTRAINT "FK_customer_crops_e3f47714"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_crops" DROP CONSTRAINT "FK_customer_crops_34501d1e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_crop_information" DROP CONSTRAINT "FK_customer_crop_information_8a87ad8e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_crop_information_cultivations" DROP CONSTRAINT "FK_customer_crop_information_cultivations_20dce789"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_crop_information_cultivations" DROP CONSTRAINT "FK_customer_crop_information_cultivations_346ca654"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_activities" DROP CONSTRAINT "FK_customer_activities_0b10469e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_activities" DROP CONSTRAINT "FK_customer_activities_77282126"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_persons" DROP CONSTRAINT "FK_customer_persons_30a5029c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_persons" DROP CONSTRAINT "FK_customer_persons_d865249f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_persons" DROP CONSTRAINT "FK_customer_persons_ee303cbe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_locations" DROP CONSTRAINT "FK_customer_locations_da3b6721"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_functions" DROP CONSTRAINT "FK_plan_functions_286db996"`,
    );
    await queryRunner.query(
      `ALTER TABLE "companies" DROP CONSTRAINT "FK_companies_6398f263"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_users_5ed72dcd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "persons" DROP CONSTRAINT "FK_persons_44b39ad6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cities" DROP CONSTRAINT "FK_cities_1229b56a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_customer_crops_locations_customer_locations_d2b686a9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_customer_crops_locations_customer_locations_5c502b65"`,
    );
    await queryRunner.query(
      `DROP TABLE "customer_crops_locations_customer_locations"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_customers_cfbf0c41"`);
    await queryRunner.query(`DROP TABLE "customers"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_customer_crops_246d2701"`,
    );
    await queryRunner.query(`DROP TABLE "customer_crops"`);
    await queryRunner.query(`DROP TYPE "public"."customer_crops_status_enum"`);
    await queryRunner.query(`DROP TABLE "crops"`);
    await queryRunner.query(`DROP TYPE "public"."crops_type_enum"`);
    await queryRunner.query(`DROP TABLE "customer_crop_information"`);
    await queryRunner.query(
      `DROP TYPE "public"."customer_crop_information_type_crop_enum"`,
    );
    await queryRunner.query(
      `DROP TABLE "customer_crop_information_cultivations"`,
    );
    await queryRunner.query(`DROP TABLE "cultivations"`);
    await queryRunner.query(`DROP TABLE "customer_activities"`);
    await queryRunner.query(`DROP TABLE "customer_persons"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_customer_locations_677e7fdb"`,
    );
    await queryRunner.query(`DROP TABLE "customer_locations"`);
    await queryRunner.query(`DROP TABLE "activities"`);
    await queryRunner.query(`DROP TABLE "plans"`);
    await queryRunner.query(`DROP TABLE "plan_functions"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_companies_703760d0"`);
    await queryRunner.query(`DROP TABLE "companies"`);
    await queryRunner.query(`DROP TABLE "employees"`);
    await queryRunner.query(
      `DROP TYPE "public"."employees_contract_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "event_types"`);
    await queryRunner.query(`DROP TABLE "occupations"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "persons"`);
    await queryRunner.query(`DROP TYPE "public"."persons_gender_enum"`);
    await queryRunner.query(`DROP TABLE "cities"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_states_291725a0"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_states_fe52f024"`);
    await queryRunner.query(`DROP TABLE "states"`);
    await queryRunner.query(
      `ALTER TABLE "contracts" DROP CONSTRAINT "FK_contracts_customer_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contracts" DROP CONSTRAINT "FK_contracts_person_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contracts" DROP CONSTRAINT "FK_contracts_company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contracts" DROP CONSTRAINT "FK_contracts_plan_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contracts" DROP CONSTRAINT "CHK_contracts_company_or_person"`,
    );
    await queryRunner.query(`DROP TABLE "contracts"`);
  }
}
