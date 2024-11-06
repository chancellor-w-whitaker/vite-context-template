import { useState } from "react";

export const usePrevious = (value, callback) => {
  const [previousValue, setPreviousValue] = useState(value);

  if (previousValue !== value) {
    setPreviousValue(value);

    callback(previousValue);
  }

  return previousValue;
};
