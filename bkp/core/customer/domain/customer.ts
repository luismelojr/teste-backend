import { UUID } from '../../../../../shared/types/uuid';

interface CustomerProps {
  id?: number;
  uuid?: UUID;
  identifier: string;
  group_identifier?: string;
  description?: string;
  financial_tools?: boolean;
  grain_consumer?: boolean;
  own_grain?: boolean;
  annual_quantity?: number;
  receive_third_grains?: boolean;
  receives_land_rent?: boolean;
}

export class Customer {
  private readonly _id?: number;
  private readonly _uuid?: UUID;
  private readonly _identifier: string;
  private readonly _group_identifier?: string;
  private readonly _description?: string;
  private readonly _financial_tools?: boolean;
  private readonly _grain_consumer?: boolean;
  private readonly _own_grain?: boolean;
  private readonly _annual_quantity?: number;
  private readonly _receive_third_grains?: boolean;
  private readonly _receives_land_rent?: boolean;

  constructor(props: CustomerProps) {
    this._id = props.id;
    this._uuid = props.uuid;
    this._identifier = props.identifier;
    this._group_identifier = props.group_identifier;
    this._description = props.description;
    this._financial_tools = props.financial_tools;
    this._grain_consumer = props.grain_consumer;
    this._receives_land_rent = props.receives_land_rent;

    if (this.isComplete()) {
      if (props.financial_tools === undefined) {
        throw new Error('Financial Tools is required.');
      }
      if (props.grain_consumer === undefined) {
        throw new Error('Grain Consumer is required.');
      }
      if (props.receives_land_rent === undefined) {
        throw new Error('Receives Land Rent is required.');
      }

      // Regras condicionais para grain_consumer
      if (props.grain_consumer) {
        this._own_grain = props.own_grain;
        this._annual_quantity = props.annual_quantity;
        this._receive_third_grains = props.receive_third_grains;
      } else {
        if (
          props.own_grain !== undefined ||
          props.annual_quantity !== undefined ||
          props.receive_third_grains !== undefined
        ) {
          throw new Error('Os campos own_grain, annual_quantity e receive_third_grains só podem ser preenchidos se grain_consumer for true.');
        }
      }
    }
  }

  static create(props: Omit<CustomerProps, 'id' | 'uuid'>): Customer {
    if (!props.identifier) {
      throw new Error('Identifier is required.');
    }

    return new Customer(props);
  }

  /**
   * Verifica se o Customer é completo, ou seja, se possui os campos obrigatórios de um cadastro completo.
   */
  isComplete(): boolean {
    return (
      this._group_identifier !== undefined &&
      this._financial_tools !== undefined &&
      this._grain_consumer !== undefined &&
      this._receives_land_rent !== undefined
    );
  }

  get id(): number | undefined {
    return this._id;
  }

  get uuid(): UUID | undefined {
    return this._uuid;
  }

  get identifier(): string {
    return this._identifier;
  }

  get group_identifier(): string | undefined {
    return this._group_identifier;
  }

  get description(): string | undefined {
    return this._description;
  }

  get financial_tools(): boolean | undefined {
    return this._financial_tools;
  }

  get grain_consumer(): boolean | undefined {
    return this._grain_consumer;
  }

  get own_grain(): boolean | undefined {
    return this._own_grain;
  }

  get annual_quantity(): number | undefined {
    return this._annual_quantity;
  }

  get receive_third_grains(): boolean | undefined {
    return this._receive_third_grains;
  }

  get receives_land_rent(): boolean | undefined {
    return this._receives_land_rent;
  }
}
