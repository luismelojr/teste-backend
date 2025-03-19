import { generateUuidV4, isValidUUID } from './uuid-v4';

describe('UuidV4', () => {
  describe('generateUuidV4', () => {
    it('should generate a valid UUID v4 string', () => {
      const uuid = generateUuidV4();
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      expect(uuid).toMatch(uuidRegex);
    });

    it('should generate unique UUIDs for multiple invocations', () => {
      const uuid1 = generateUuidV4();
      const uuid2 = generateUuidV4();

      expect(uuid1).not.toEqual(uuid2);
    });
  });

  describe('isValidUUID', () => {
    it('should return true for a valid UUID v4', () => {
      const validUUID = 'a32cd39b-cbff-4987-9714-601b39011074';
      expect(isValidUUID(validUUID)).toBe(true);
    });

    it('should return false for an invalid UUID', () => {
      const invalidUUID = 'invalid-uuid-1234';
      expect(isValidUUID(invalidUUID)).toBe(false);
    });

    it('should return false for an empty string', () => {
      const emptyString = '';
      expect(isValidUUID(emptyString)).toBe(false);
    });

    it('should return false for a UUID without dashes', () => {
      const noDashUUID = 'a32cd39bcbff49879714601b39011074';
      expect(isValidUUID(noDashUUID)).toBe(false);
    });

    it('should return false for a UUID with invalid characters', () => {
      const invalidCharUUID = 'z32cd39b-cbff-4987-9714-601b39011074'; // 'z' is not a valid hex character
      expect(isValidUUID(invalidCharUUID)).toBe(false);
    });
  });
});
