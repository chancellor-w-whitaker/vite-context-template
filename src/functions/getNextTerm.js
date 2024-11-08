export const getNextTerm = (lastTerm, fileName, skip = 1) => {
  if (["graduation", "spring", "summer", "fall"].includes(fileName))
    return `${lastTerm.split(" ")[0]} ${Number(lastTerm.split(" ")[1]) + skip}`;

  if (["degrees", "hours"].includes(fileName))
    return `${Number(lastTerm.split("-")[0]) + skip}-${
      Number(lastTerm.split("-")[1]) + skip
    }`;

  if (["retention"].includes(fileName))
    return `Fall ${Number(lastTerm.split(" ")[1]) + skip} to Fall ${
      Number(lastTerm.split(" ")[4]) + skip
    }`;
};
