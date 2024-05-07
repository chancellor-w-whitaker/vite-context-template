export const getNextTerm = (lastTerm, fileName) => {
  if (["graduation", "spring", "summer", "fall"].includes(fileName))
    return `${lastTerm.split(" ")[0]} ${Number(lastTerm.split(" ")[1]) + 1}`;

  if (["degrees", "hours"].includes(fileName))
    return `${Number(lastTerm.split("-")[0]) + 1}-${
      Number(lastTerm.split("-")[1]) + 1
    }`;

  if (["retention"].includes(fileName))
    return `Fall ${Number(lastTerm.split(" ")[1]) + 1} to Fall ${
      Number(lastTerm.split(" ")[4]) + 1
    }`;
};
