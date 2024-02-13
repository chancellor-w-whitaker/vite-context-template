export const RateCellRenderer = (params) => {
  // put the value in bold
  return (
    <>
      <span className="fw-light small text-body-secondary">
        {params?.valueFormatted?.[1]}
      </span>{" "}
      <span className="fw-medium fst-italic">
        {params?.valueFormatted?.[0]}
      </span>
    </>
  );
};
