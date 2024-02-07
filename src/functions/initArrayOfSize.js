export const initArrayOfSize = (length = 5) => {
  return Array.from({ length }, (x, i) => i + 1);
};
