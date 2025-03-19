import crypto from 'crypto';

export default class UUID {
  private value: string;

  constructor(uuid: string) {
    if (!this.isValidUuid(uuid)) throw new Error('invalid uuid');
    this.value = uuid;
  }

  isValidUuid(uuid: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  static create() {
    const uuid = crypto.randomUUID();
    return new UUID(uuid);
  }


  getValue() {
    return this.value;
  }

}
