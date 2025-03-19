import { DeleteDateColumn } from 'typeorm';

export function DeletedAt() {
  return function(target: object, propertyName: string): void {
    DeleteDateColumn({
      type: 'timestamp without time zone',
      name: 'deleted_at',
      nullable: true,
    })(target, propertyName);
  };
}
