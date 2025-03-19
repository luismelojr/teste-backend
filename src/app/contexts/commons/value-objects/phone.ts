export default class Phone {
  private value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error('invalid phone number');
    }
    this.value = value;
  }

  isValid(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }

  getValue() {
    return this.value;
  }

}
