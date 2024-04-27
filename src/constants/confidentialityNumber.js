const confidentialityNumber = 5;

export default confidentialityNumber;

export const isConfidential = ({ inFuture, isRate, value }) =>
  !(value > confidentialityNumber || value === 0 || inFuture || isRate);

export const confidentialityString = `≤${confidentialityNumber}`;
