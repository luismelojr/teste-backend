import { removeUndefined, removeUndefinedOfItems } from './remove-undefined';

describe('remove undefined', () => {
  describe('removeUndefined', () => {
    it('should remove undefined properties from an object', () => {
      const obj = {
        defined: 'value',
        undefinedValue: undefined,
      };
      const expected = {
        defined: 'value',
      };
      expect(removeUndefined(obj)).toEqual(expected);
    });

    it('should trim strings', () => {
      const obj = {
        name: ' John Doe ',
      };
      const expected = {
        name: 'John Doe',
      };
      expect(removeUndefined(obj)).toEqual(expected);
    });

    it('should handle array of objects', () => {
      const obj = {
        items: [
          { name: 'Item 1', value: undefined },
          { name: 'Item 2', value: 'Value 2' },
        ],
      };
      const expected = {
        items: [{ name: 'Item 1' }, { name: 'Item 2', value: 'Value 2' }],
      };
      expect(removeUndefined(obj)).toEqual(expected);
    });

    it('should handle nested objects', () => {
      const obj = {
        nested: {
          defined: 'value',
          undefinedValue: undefined,
        },
      };
      const expected = {
        nested: {
          defined: 'value',
        },
      };
      expect(removeUndefined(obj)).toEqual(expected);
    });

    it('should preserve dates', () => {
      const date = new Date();
      const obj = {
        date,
      };
      const expected = {
        date,
      };
      expect(removeUndefined(obj)).toEqual(expected);
    });

    it('should handle array of arrays', () => {
      const obj = {
        matrix: [
          [undefined, 2],
          [3, 4],
        ],
      };
      const expected = {
        matrix: [[2], [3, 4]],
      };
      expect(removeUndefined(obj)).toEqual(expected);
    });
  });

  describe('removeUndefinedOfItems', () => {
    it('should remove undefined properties from each object in an array', () => {
      const items = [
        { name: 'Item 1', value: undefined },
        { name: 'Item 2', value: 'Value 2' },
      ];
      const expected = [
        { name: 'Item 1' },
        { name: 'Item 2', value: 'Value 2' },
      ];
      expect(removeUndefinedOfItems(items)).toEqual(expected);
    });
  });
});
