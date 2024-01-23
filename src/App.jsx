import { useConsumeAppContext } from "./hooks/useConsumeAppContext";
import { MainContainer } from "./components/MainContainer";
import { toTitleCase } from "./functions/toTitleCase";

const App = () => {
  const { dropdowns, rows } = useConsumeAppContext();

  return (
    <>
      <MainContainer>
        <div className="d-flex flex-column gap-4">
          <div className="d-flex flex-wrap gap-3">
            {Object.entries(dropdowns.state).map(([field, checklist]) => {
              const numCheckedAndRelevant = dropdowns.lists[
                field
              ].relevant.filter((value) => checklist[value]).length;

              const numRelevant = dropdowns.lists[field].relevant.length;

              const fraction = `${numCheckedAndRelevant} / ${numRelevant}`;

              const allRelevantNotChecked = numCheckedAndRelevant < numRelevant;

              return (
                <div className="dropdown col" key={field}>
                  <button
                    className="btn btn-light dropdown-toggle w-100 shadow-sm d-flex justify-content-center align-items-center"
                    ref={(target) => dropdowns.targetStorer(field, target)}
                    data-bs-auto-close="outside"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    type="button"
                  >
                    {toTitleCase(field)}
                    <span
                      className={`position-absolute top-0 start-100 translate-middle badge rounded-pill bg-${
                        allRelevantNotChecked ? "danger" : "success"
                      } pe-none z-1 shadow-sm opacity-${
                        allRelevantNotChecked ? 100 : 100
                      }`}
                      style={{
                        transition: "all 0.15s ease-in-out",
                      }}
                    >
                      {fraction}
                    </span>
                  </button>
                  <ul
                    className="dropdown-menu shadow-sm overflow-y-scroll pt-0"
                    style={{ maxHeight: 300 }}
                  >
                    {dropdowns.menuShownChecker(field) && (
                      <div className="list-group">
                        <div className="list-item-sticky pt-2 bg-white">
                          <label className="list-group-item d-flex gap-2 border-0">
                            <input
                              checked={
                                !Object.values(checklist).some(
                                  (condition) => !condition
                                )
                              }
                              className="form-check-input flex-shrink-0"
                              onChange={dropdowns.onChange}
                              type={dropdowns.inputType}
                              name={field}
                              value=""
                            />
                            <span>All</span>
                          </label>
                        </div>
                        {dropdowns.lists[field].relevant.map((value) => (
                          <label
                            className={`list-group-item d-flex gap-2 border-0 opacity-100`}
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
                        {dropdowns.lists[field].irrelevant.map((value) => (
                          <label
                            className={`list-group-item d-flex gap-2 border-0 opacity-50`}
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
          {rows.filtered.loading
            ? "Loading..."
            : `${rows.filtered.data.length} rows`}
        </div>
      </MainContainer>
    </>
  );
};

export default App;
