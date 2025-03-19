import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export function CreatedAt() {
  return function (target: object, propertyName: string): void {
    CreateDateColumn({
      type: 'timestamp without time zone',
      name: 'created_at',
      default: () => 'CURRENT_TIMESTAMP(6)',
    })(target, propertyName);
  };
}

export function UpdatedAt() {
  return function (target: object, propertyName: string): void {
    UpdateDateColumn({
      type: 'timestamp without time zone',
      name: 'updated_at',
      default: () => 'CURRENT_TIMESTAMP(6)',
    })(target, propertyName);
  };
}

export function DeletedAt() {
  return function (target: object, propertyName: string): void {
    DeleteDateColumn({
      type: 'timestamp without time zone',
      name: 'deleted_at',
      nullable: true,
    })(target, propertyName);
  };
}
