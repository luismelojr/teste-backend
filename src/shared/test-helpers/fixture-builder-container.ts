import { EntityPrimaryKey } from 'shared/types/entity-primary-key';

export default class FixtureBuilderContainer {
  private opts: {
    initialCompanyId: EntityPrimaryKey;
    initialPersonId: EntityPrimaryKey;
    initialUserId: EntityPrimaryKey;
    initialEventTypeId: EntityPrimaryKey;
    initialPlanId: EntityPrimaryKey;
    initialOccupationId: EntityPrimaryKey;
    initialActivityId: EntityPrimaryKey;
    initialCustomerId: EntityPrimaryKey;
    initialCultivationId: EntityPrimaryKey;
    initialCropId: EntityPrimaryKey;

    initialCustomerActivityId: EntityPrimaryKey;
    initialCustomerCropId: EntityPrimaryKey;
    initialCustomerCropInformationId: EntityPrimaryKey;
    initialCustomerCropInformationCultivationId: EntityPrimaryKey;
    initialCustomerLocationId: EntityPrimaryKey;
    initialCustomerPersonId: EntityPrimaryKey;
    initialContractId: EntityPrimaryKey;
  };

  private currentCompanyId: EntityPrimaryKey;
  private currentPersonId: EntityPrimaryKey;
  private currentUserId: EntityPrimaryKey;
  private currentEventTypeId: EntityPrimaryKey;
  private currentPlanId: EntityPrimaryKey;
  private currentOccupationId: EntityPrimaryKey;
  private currentActivityId: EntityPrimaryKey;
  private currentCustomerId: EntityPrimaryKey;
  private currentCultivationId: EntityPrimaryKey;
  private currentCropId: EntityPrimaryKey;

  private currentCustomerActivityId: EntityPrimaryKey;
  private currentCustomerCropId: EntityPrimaryKey;
  private currentCustomerCropInformationId: EntityPrimaryKey;
  private currentCustomerCropInformationCultivationId: EntityPrimaryKey;
  private currentCustomerLocationId: EntityPrimaryKey;
  private currentCustomerPersonId: EntityPrimaryKey;
  private currentContractId: EntityPrimaryKey;

  get defaults() {
    return {
      initialCompanyId: this.getInitialValue(),
      initialPersonId: this.getInitialValue(),
      initialUserId: this.getInitialValue(),
      initialEventTypeId: this.getInitialValue(),
      initialPlanId: this.getInitialValue(),
      initialOccupationId: this.getInitialValue(),
      initialActivityId: this.getInitialValue(),
      initialCustomerId: this.getInitialValue(),
      initialCultivationId: this.getInitialValue(),
      initialCropId: this.getInitialValue(),

      initialCustomerActivityId: this.getInitialValue(),
      initialCustomerCropId: this.getInitialValue(),
      initialCustomerCropInformationId: this.getInitialValue(),
      initialCustomerCropInformationCultivationId: this.getInitialValue(),
      initialCustomerLocationId: this.getInitialValue(),
      initialCustomerPersonId: this.getInitialValue(),
      initialContractId: this.getInitialValue(),
    };
  }

  constructor(options = {}) {
    const opts = { ...this.defaults, ...options };
    this.opts = opts;
    this.currentCompanyId = opts.initialCompanyId;
    this.currentPersonId = opts.initialPersonId;
    this.currentUserId = opts.initialUserId;
    this.currentEventTypeId = opts.initialEventTypeId;
    this.currentPlanId = opts.initialPlanId;
    this.currentPersonId = opts.initialCompanyId;
    this.currentUserId = opts.initialCompanyId;
    this.currentOccupationId = opts.initialOccupationId;
    this.currentActivityId = opts.initialActivityId;
    this.currentCustomerId = opts.initialCustomerId;
    this.currentCultivationId = opts.initialCultivationId;
    this.currentCropId = opts.initialCropId;

    this.currentCustomerActivityId = opts.initialCustomerActivityId;
    this.currentCustomerCropId = opts.initialCustomerCropId;
    this.currentCustomerCropInformationId = opts.initialCustomerCropInformationId;
    this.currentCustomerCropInformationCultivationId = opts.initialCustomerCropInformationCultivationId;
    this.currentCustomerLocationId = opts.initialCustomerLocationId;
    this.currentCustomerPersonId = opts.initialCustomerPersonId;
    this.currentContractId = opts.initialContractId;
  }

  get companyId(): EntityPrimaryKey {
    return this.currentCompanyId;
  }

  get personId(): EntityPrimaryKey {
    return this.currentPersonId;
  }

  get userId(): EntityPrimaryKey {
    return this.currentUserId;
  }

  get eventTypeId(): EntityPrimaryKey {
    return this.currentUserId;
  }

  get planId(): EntityPrimaryKey {
    return this.currentPlanId;
  }

  get occupationId(): EntityPrimaryKey {
    return this.currentOccupationId;
  }

  get activityId(): EntityPrimaryKey {
    return this.currentActivityId;
  }

  get customerId(): EntityPrimaryKey {
    return this.currentCustomerId;
  }

  get cultivationId(): EntityPrimaryKey {
    return this.currentCultivationId;
  }

  get cropId(): EntityPrimaryKey {
    return this.currentCropId;
  }

  get customerActivityId(): EntityPrimaryKey {
    return this.currentCustomerActivityId;
  }

  get customerCropId(): EntityPrimaryKey {
    return this.currentCustomerCropId;
  }

  get customerCropInformationId(): EntityPrimaryKey {
    return this.currentCustomerCropInformationId;
  }

  get customerCropInformationCultivationId(): EntityPrimaryKey {
    return this.currentCustomerCropInformationCultivationId;
  }

  get customerLocationId(): EntityPrimaryKey {
    return this.currentCustomerLocationId;
  }

  get customerPersonId(): EntityPrimaryKey {
    return this.currentCustomerPersonId;
  }

  get contractId(): EntityPrimaryKey {
    return this.currentContractId;
  }


  newCompany() {
    this.currentPersonId = this.increment(this.currentPersonId);
  }

  newPerson() {
    this.currentPersonId = this.increment(this.currentPersonId);
  }

  newUser() {
    this.currentUserId = this.increment(this.currentUserId);
  }

  newEventType() {
    this.currentUserId = this.increment(this.currentUserId);
  }

  newPlan() {
    this.currentPlanId = this.increment(this.currentPlanId);
  }

  newOccupation() {
    this.currentOccupationId = this.increment(this.currentOccupationId);
  }

  newActivity() {
    this.currentActivityId = this.increment(this.currentActivityId);
  }

  newCustomer() {
    this.currentCustomerId = this.increment(this.currentCustomerId);
  }

  newCultivation() {
    this.currentCultivationId = this.increment(this.currentCultivationId);
  }

  newCrop() {
    this.currentCropId = this.increment(this.currentCropId);
  }

  newCustomerActivity() {
    this.currentCustomerActivityId = this.increment(this.currentCustomerActivityId);
  }

  newCustomerCrop() {
    this.currentCustomerCropId = this.increment(this.currentCustomerCropId);
  }

  newCustomerCropInformation() {
    this.currentCustomerCropInformationId = this.increment(this.currentCustomerCropInformationId);
  }

  newCustomerCropInformationCultivation() {
    this.currentCustomerCropInformationCultivationId = this.increment(this.currentCustomerCropInformationCultivationId);
  }

  newCustomerLocation() {
    this.currentCustomerLocationId = this.increment(this.currentCustomerLocationId);
  }

  newCustomerPerson() {
    this.currentCustomerPersonId = this.increment(this.currentCustomerPersonId);
  }

  newContract() {
    this.currentContractId = this.increment(this.currentContractId);
  }


  private increment(string: EntityPrimaryKey): EntityPrimaryKey {
    return String(BigInt(string) + BigInt(1));
  }

  private getInitialValue() {
    return '0';
  }

}
