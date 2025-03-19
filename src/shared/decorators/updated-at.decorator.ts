import { UpdateDateColumn } from 'typeorm';

export function UpdatedAt() {
  return function (target: object, propertyName: string): void {
    UpdateDateColumn({
      type: 'timestamp without time zone',
      name: 'updated_at',
      default: () => 'CURRENT_TIMESTAMP(6)',
    })(target, propertyName);
  };
}
