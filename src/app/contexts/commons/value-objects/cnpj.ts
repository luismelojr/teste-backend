export default class Cnpj {
  private value: string;

  constructor(cnpj: string) {
    if (!this.isValidCnpj(cnpj)) throw new Error('invalid cnpj');
    this.value = this.clean(cnpj);
  }

  private isValidCnpj(cnpj: string) {
    if (!cnpj) return false;
    cnpj = this.clean(cnpj);
    if (cnpj.length !== 14) return false;
    if (this.allDigitsTheSame(cnpj)) return false;
    const baseCnpj = cnpj.slice(0, 12);
    const digit1 = this.calculateDigit(baseCnpj);
    const digit2 = this.calculateDigit(baseCnpj + digit1);
    const actualDigits = cnpj.slice(12);
    return actualDigits === `${digit1}${digit2}`;
  }

  private clean(cnpj: string) {
    return cnpj.replace(/\D/g, '');
  }

  private allDigitsTheSame(cnpj: string) {
    const [firstDigit] = cnpj;
    return [...cnpj].every(c => c === firstDigit);
  }

  private calculateDigit(cnpj: string) {
    const weights = cnpj.length === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    let total = 0;
    for (let i = 0; i < cnpj.length; i++) {
      total += parseInt(cnpj[i]) * weights[i];
    }
    const remainder = total % 11;
    return remainder < 2 ? '0' : String(11 - remainder);
  }

  getValue() {
    return this.value;
  }
}
