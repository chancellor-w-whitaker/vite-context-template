import { getBaseLog } from "./getBaseLog";

const getLargestMultipleOfXInY = ({ y, x }) => {
  return Math.floor(y / x) * x;
};

const getFirstMultipleOfXFollowingY = ({ y, x }) => {
  return Math.ceil(y / x) * x;
};

const getNextNumberFollowingXDivisibleByY = ({ x, y }) => {
  return x % y === 0 ? x : x + (y - (x % y));
};

// console.log(getNextNumberFollowingXDivisibleByY({ x: 16, y: 4 }));

const getSecondLargestPowerOfXInY = ({ x, y }) => {
  const flooredXLogOfY = Math.floor(getBaseLog(x, y)) - 1;

  return Math.pow(x, flooredXLogOfY);
};

export const getTicksAndDomain = ({
  dataValues = [],
  tickCount = 5,
  base = 10,
}) => {
  const [dataMin, dataMax] = [Math.min(...dataValues), Math.max(...dataValues)];

  const dataRange = dataMax - dataMin;

  const minDeductedByRange = dataMin - dataRange > 0 ? dataMin - dataRange : 0;

  const secondLargestPowerOfXInY = getSecondLargestPowerOfXInY({
    y: dataRange,
    x: base,
  });

  const lowerBound = Math.floor(minDeductedByRange / secondLargestPowerOfXInY);

  const upperBound = Math.ceil(dataMax / secondLargestPowerOfXInY);

  const distanceBetweenBounds = upperBound - lowerBound;

  const minimumDistanceForEquidistantTicks =
    getNextNumberFollowingXDivisibleByY({
      x: distanceBetweenBounds,
      y: tickCount - 1,
    });

  const distanceBetweenEachTick =
    minimumDistanceForEquidistantTicks / (tickCount - 1);

  const ticks = [...Array(tickCount).keys()].map(
    (tickIndex) =>
      (lowerBound + distanceBetweenEachTick * tickIndex) *
      secondLargestPowerOfXInY
  );

  const domain = [ticks[0], ticks[ticks.length - 1]];

  return { domain, ticks };
};
