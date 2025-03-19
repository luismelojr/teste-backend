export default class Name {
  private value: string;

  constructor(name: string) {
    if (!this.isValidName(name)) throw new Error(`invalid name: ${name}`);
    this.value = name;
  }

  isValidName(name: string) {
    return name.match(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/);
  }

  getValue() {
    return this.value;
  }
}
