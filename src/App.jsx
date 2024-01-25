import { useConsumeAppContext } from "./hooks/useConsumeAppContext";
import { MainContainer } from "./components/MainContainer";
import { toTitleCase } from "./functions/toTitleCase";

const App = () => {
  const { dropdowns, rows } = useConsumeAppContext();

  return (
    <>
      <MainContainer>
        <div className="d-flex flex-column gap-4">
          {/* flex container for dropdown filters */}
          <div className="d-flex flex-wrap gap-3">
            {/* iterates over dropdown entries in state--meaning will include data-irrelevant dropdowns when those are saved */}
            {Object.entries(dropdowns.state).map(([field, checklist]) => {
              const { irrelevant, relevant } = dropdowns.lists[field];

              // of relevant values for each field (even though in the future some fields will be data-irrelevant), find number of those values that are checked
              const totalCheckedAndRelevant = relevant.filter(
                (value) => checklist[value]
              ).length;

              // just take length of relevant list
              const totalRelevant = relevant.length;

              // fraction to be displayed (fraction of checked values of relevant values)
              const fraction = `${totalCheckedAndRelevant} / ${totalRelevant}`;

              // if total relevant & checked values is < total relevant values, some are unchecked
              const someRelevantUnchecked =
                totalCheckedAndRelevant < totalRelevant;

              return (
                // added "col" to stretch div evenly
                <div className="dropdown col" key={field}>
                  {/* added "w-100" to stretch button across stretched div */}
                  {/* centered using flex utilities in order to properly align dropdown toggle */}
                  <button
                    className="btn btn-light bg-gradient dropdown-toggle w-100 shadow-sm position-relative d-flex justify-content-center align-items-center"
                    // stores dropdown identifier with target to be used when opting in to dynamic dropdown menu rendering
                    ref={(target) => dropdowns.storeTarget(field, target)}
                    data-bs-auto-close="outside"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    type="button"
                  >
                    {toTitleCase(field)}
                    {/* use some unchecked condition to present badge differently */}
                    <span
                      className={`position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger pe-none z-1 shadow-sm opacity-${
                        someRelevantUnchecked ? 100 : 0
                      }`}
                      // in case you change how you transition fraction badge, transition all
                      style={{
                        transition: "all 0.15s ease-in-out",
                      }}
                    >
                      {fraction}
                    </span>
                  </button>
                  {/* remove padding top from dropdown menu because is added to sticky "All" buttons */}
                  <ul
                    className="dropdown-menu shadow-sm overflow-y-scroll pt-0"
                    style={{ maxHeight: 300 }}
                  >
                    {/* opt in to dynamic rendering of dropdown menu content (using dropdown identifier) */}
                    {dropdowns.checkShown(field) && (
                      <div className="list-group">
                        {/* "All" button */}
                        <label className="list-group-item list-item-sticky d-flex gap-2 border-0 shadow-sm pt-3">
                          <input
                            // is checked as long as no condition unchecked
                            checked={
                              !Object.values(checklist).some(
                                (condition) => !condition
                              )
                            }
                            className="form-check-input flex-shrink-0"
                            onChange={dropdowns.onChange}
                            type={dropdowns.inputType}
                            name={field}
                            // value could be undefined or ""--specified "" to be more explicit about intention
                            value=""
                          />
                          {/* for now, includes number of items in checklist */}
                          <span>All ({Object.keys(checklist).length})</span>
                        </label>
                        {/* present relevant options first */}
                        {relevant.map((value) => (
                          <label
                            className="list-group-item d-flex gap-2 border-0"
                            key={value}
                          >
                            <input
                              className="form-check-input flex-shrink-0"
                              onChange={dropdowns.onChange}
                              type={dropdowns.inputType}
                              checked={checklist[value]}
                              value={value}
                              name={field}
                            />
                            <span>{value}</span>
                          </label>
                        ))}
                        {/* present irrelevant values next */}
                        {irrelevant.map((value) => (
                          <label
                            className="list-group-item d-flex gap-2 border-0 opacity-50"
                            key={value}
                          >
                            <input
                              className="form-check-input flex-shrink-0"
                              onChange={dropdowns.onChange}
                              type={dropdowns.inputType}
                              checked={checklist[value]}
                              value={value}
                              name={field}
                            />
                            <span>{value}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
          {/* example of data being modified by dropdowns */}
          {/* flex utilities force this section to have gap between itself and dropdowns above */}
          {rows.filtered.loading
            ? "Loading..."
            : `${rows.filtered.data.length.toLocaleString()} / ${rows.current.data.length.toLocaleString()} rows`}
        </div>
      </MainContainer>
    </>
  );
};

export default App;
