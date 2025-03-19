export interface IFormatExceptionMessage {
  title: string;
  message: string;
  statusCode?: number;
  data?: string;
}

export class ValidationError extends Error implements IFormatExceptionMessage {
  private readonly _data: string;
  private readonly _message: string;
  private readonly _statusCode: number;
  private readonly _title: string;

  constructor({ data, message, statusCode, title }: IFormatExceptionMessage) {
    super();
    this._data = data;
    this._message = message;
    this._statusCode = statusCode;
    this._title = title;
  }

  get data(): string {
    return this._data;
  }

  get message(): string {
    return this._message;
  }

  get statusCode(): number {
    return this._statusCode;
  }

  get title(): string {
    return this._title;
  }
}
