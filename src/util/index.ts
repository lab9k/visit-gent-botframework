export const isRequired = (name = '') => {
  throw new Error(`param ${name} is required`);
};
