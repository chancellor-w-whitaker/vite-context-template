import regression from "regression";

import { initArrayOfSize } from "./initArrayOfSize";

export const findRegressionData = ({
  amountToPredict = 3,
  factor = 1000000,
  keyName,
  data,
  type,
}) => {
  const dataPoints = findRegressionDataPoints(data, keyName, factor);

  const regressionResult = findOriginalRegressionResult(type, dataPoints);

  const newRegressionResult = findNewRegressionResult({
    regressionResult,
    amountToPredict,
    factor,
  });

  const final = {
    inputPoints: dataPoints.map(([x, y]) => [x, y / factor]),
    ...newRegressionResult,
  };

  return final;
};

const findRegressionDataPoints = (data, keyName, factor = 1000000) => {
  return data.map(({ [keyName]: value }, index) => [index + 1, value * factor]);
};

export const findOriginalRegressionResult = (regressionType, dataPoints) => {
  let result;

  const options = { precision: 10 };

  switch (regressionType) {
    case "linear":
      result = regression.linear(dataPoints, options);
      break;
    case "exponential":
      result = regression.exponential(dataPoints, options);
      break;
    case "logarithmic":
      result = regression.logarithmic(dataPoints, options);
      break;
    case "power":
      result = regression.power(dataPoints, options);
      break;
    case "polynomial":
      result = regression.polynomial(dataPoints, options);
      break;
  }

  return result;
};

export const findNewEquation = (regressionResult, factor = 1000000) => {
  const collection = [];

  const equation = regressionResult.equation.map((number) => number / factor);

  let stringToSplit = regressionResult.string;

  const values = regressionResult.equation;

  values.forEach((value) => {
    const currentValue = `${value}`;

    const indexOfValue = stringToSplit.indexOf(currentValue);

    const precedingString = stringToSplit.slice(0, indexOfValue);

    collection.push(precedingString, currentValue);

    stringToSplit = stringToSplit.slice(indexOfValue + currentValue.length);
  });

  collection.push(stringToSplit);

  const newValues = equation;

  const newCollection = [...collection];

  newValues.forEach(
    (value, index) => (newCollection[index * 2 + 1] = value.toLocaleString())
  );

  const string = newCollection.join("");

  return { equation, string };
};

const findNewPoints = ({
  amountToPredict = 3,
  regressionResult,
  factor = 1000000,
}) => {
  const points = regressionResult.points.map(([x, y]) => [x, y / factor]);

  const predict = (x) =>
    regressionResult
      .predict(x)
      .map((number, index) => (index === 1 ? number / factor : number));

  const predictedPoints = initArrayOfSize(amountToPredict).map((number) =>
    predict(points.length + number)
  );

  return { nextOutputPoints: predictedPoints, outputPoints: points, predict };
};

const findNewRegressionResult = ({
  amountToPredict = 3,
  regressionResult,
  factor = 1000000,
}) => {
  return {
    ...findNewPoints({ regressionResult, amountToPredict, factor }),
    ...findNewEquation(regressionResult, factor),
    r2: regressionResult.r2,
  };
};
