export const handleGroupByChange = ({ setState, value }) =>
  setState((previousGroupBy) => {
    const nextGroupBy = previousGroupBy.filter(
      (anyField) => anyField !== value
    );

    return previousGroupBy.length !== nextGroupBy.length
      ? nextGroupBy
      : [...nextGroupBy, value];
  });
