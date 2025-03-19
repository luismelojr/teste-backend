const trimValueIfString = (value) =>
  typeof value === 'string' ? value.trim() : value;

const processArrayItem = (item) => {
  if (Array.isArray(item) || (typeof item === 'object' && item !== null)) {
    return removeUndefined(item);
  }
  return trimValueIfString(item);
};

export const removeUndefined = (obj) => {
  if (obj instanceof Date || typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.filter((item) => item !== undefined).map(processArrayItem);
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = trimValueIfString(value);
      if (typeof value === 'object') {
        acc[key] = removeUndefined(value);
      }
    }
    return acc;
  }, {});
};

export const removeUndefinedOfItems = (items) => items.map(removeUndefined);
