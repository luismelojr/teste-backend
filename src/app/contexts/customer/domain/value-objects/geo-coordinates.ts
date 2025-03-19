export class GeoCoordinates {
  private readonly _lat: number;
  private readonly _long: number;

  constructor({ lat, long }: { lat: number, long: number }) {
    if (!GeoCoordinates.isValidLatitude(lat)) {
      throw new Error(`Latitude inválida: ${lat}. Deve estar entre -90 e 90.`);
    }

    if (!GeoCoordinates.isValidLongitude(long)) {
      throw new Error(`Longitude inválida: ${long}. Deve estar entre -180 e 180.`);
    }

    this._lat = lat;
    this._long = long;
  }

  private static isValidLatitude(lat: number): boolean {
    return lat >= -90 && lat <= 90;
  }

  private static isValidLongitude(long: number): boolean {
    return long >= -180 && long <= 180;
  }

  get lat(): number {
    return this._lat;
  }

  get long(): number {
    return this._long;
  }

  public toString(): string {
    return `(${this._lat}, ${this._long})`;
  }
}
