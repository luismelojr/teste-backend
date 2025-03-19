import { Employee } from '../domain/employee';
import { UUID } from 'shared/types/uuid';
import { PaginationInput } from 'shared/abstracts/paginations/pagination.input';
import {
  PaginationOutput
} from 'shared/abstracts/paginations/pagination.output';

export abstract class EmployeeRepository {
  abstract create (employee: Employee): Promise<Employee>
  abstract findOneByUuid (uuid: UUID): Promise<Employee>
  abstract findAll ({pagination, searchText}: {pagination: PaginationInput, searchText?: string}): Promise<PaginationOutput<Employee>>
  abstract delete (uuid: UUID): void
  abstract update (employee: Employee): Promise<Employee>
  abstract findAutoComplete (query: string): Promise<any[]>
}
