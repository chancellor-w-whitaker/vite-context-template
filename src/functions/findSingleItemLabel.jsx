import { Fragment } from "react";

export const findSingleItemLabel = ({ search, value }) => {
  const indexOfQuery = value.toLowerCase().indexOf(search.toLowerCase());

  const queryFound = indexOfQuery !== -1;

  const queryValid = search.trim().length > 0;

  const shouldHighlight = queryFound && queryValid;

  return !shouldHighlight
    ? value
    : [
        {
          text: value.substring(0, indexOfQuery),
          highlight: false,
        },
        {
          text: value.substring(indexOfQuery, indexOfQuery + search.length),
          highlight: true,
        },
        {
          text: value.substring(indexOfQuery + search.length),
          highlight: false,
        },
      ].map(({ highlight, text }, index) => (
        <Fragment key={index}>
          {!highlight ? <span>{text}</span> : <mark>{text}</mark>}
        </Fragment>
      ));
};
