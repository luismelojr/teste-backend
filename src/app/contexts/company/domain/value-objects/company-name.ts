export default class CompanyName {
  private value: string;

  constructor(name: string) {
    if (!this.isValidCompanyName(name)) throw new Error(`invalid company name: ${name}`);
    this.value = name;
  }

  private isValidCompanyName(name: string) {
    return /^[\p{L}0-9@\-.,()&'"/ ]+$/u.test(name);
  }

  getValue() {
    return this.value;
  }
}
