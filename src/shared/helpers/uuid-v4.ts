import { randomUUID } from 'crypto';

export const generateUuidV4 = () => {
  return randomUUID();
};

export const isValidUUID = (uuid: string) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    uuid,
  );
};
