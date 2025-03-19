interface Contract {
  identifier: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

interface Plan {
  id: string;
  uuid: string;
  name: string;
  description: string;
}

interface Company {
  id: string;
  uuid: string;
  name: string;
  cnpj: string;
}

interface Person {
  id: string;
  uuid: string;
  name: string;
  cpf: string;
}

export const contract: Contract = {
  identifier: 'CT-001',
  description: 'Contrato anual de serviços',
  startDate: new Date('2023-01-01'),
  endDate: new Date('2023-12-31'),
};

export const plan: Plan = {
  id: '1',
  uuid: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Plano Premium',
  description: 'Plano com todos os recursos',
};

export const company: Company = {
  id: '2',
  uuid: '223e4567-e89b-12d3-a456-426614174000',
  name: 'ACME Corporation',
  cnpj: '12.345.678/0001-90',
};

export const person: Person = {
  id: '3',
  uuid: '323e4567-e89b-12d3-a456-426614174000',
  name: 'João Silva',
  cpf: '123.456.789-00',
};
