import { CreateDateColumn } from 'typeorm';

export function CreatedAt() {
  return function (target: object, propertyName: string): void {
    CreateDateColumn({
      type: 'timestamp without time zone',
      name: 'created_at',
      default: () => 'CURRENT_TIMESTAMP(6)',
    })(target, propertyName);
  };
}
