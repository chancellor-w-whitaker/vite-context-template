import { useEffect } from "react";
import { useState } from "react";

import { getRowsAndColumns } from "./functions/getRowsAndColumns";
import { findNextDropdowns } from "./functions/findNextDropdowns";
import { adjustDropdowns } from "./functions/adjustDropdowns";
import { Dashboard } from "./components/Dashboard";
import { fileNames } from "./constants/fileNames";
import { AppContextProvider } from "./AppContext";

const initialState = {};

const initialDataByFile = {};

const courseOnlineValues = new Set(["ECampus Online", "Traditional Online"]);

const dataFilterCallback = (row) => {
  if (row["onlineDesc"] && row["onlineDesc"] !== "Online Program") {
    return false;
  }

  if (row["course_online"] && !courseOnlineValues.has(row["course_online"])) {
    return false;
  }

  return true;
};

const App = () => {
  const [state, setState] = useState(initialState);

  const [dataByFile, setDataByFile] = useState(initialDataByFile);

  useEffect(() => {
    const allPromises = fileNames.map(({ id }) =>
      fetch(`data/${id}.json`).then((response) => response.json())
    );

    const dataByFile = {};

    Promise.all(allPromises).then((json) => {
      json.forEach(
        (array, index) =>
          (dataByFile[fileNames[index].id] = array.filter(dataFilterCallback))
      );

      const data = json.flat().filter(dataFilterCallback);

      const { columns } = getRowsAndColumns(data);

      const nextDropdowns = findNextDropdowns(columns);

      const defaultDropdowns = {};

      adjustDropdowns({
        defaultDropdowns,
        nextDropdowns,
        setState,
      });
    });

    setDataByFile(dataByFile);
  }, []);

  const ready = state !== initialState && dataByFile !== initialDataByFile;

  return (
    <>
      {/* <MainContainer> */}
      <h1 className="display-3 mb-1 text-center">EKU Online</h1>
      {!ready ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border m-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <AppContextProvider initialDropdowns={state} dataByFile={dataByFile}>
          <Dashboard></Dashboard>
        </AppContextProvider>
      )}
      {/* </MainContainer> */}
    </>
  );
};

export default App;
