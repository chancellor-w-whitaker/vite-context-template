import { useEffect } from "react";
import { useState } from "react";

import { dataFilterCallback } from "./functions/dataFilterCallback";
import { getRowsAndColumns } from "./functions/getRowsAndColumns";
import { findNextDropdowns } from "./functions/findNextDropdowns";
import { adjustDropdowns } from "./functions/adjustDropdowns";
import { isEkuOnline } from "./constants/isEkuOnline";
import { Dashboard } from "./components/Dashboard";
import { fileNames } from "./constants/fileNames";
import { AppContextProvider } from "./AppContext";

const initialState = {};

const App = () => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const allPromises = fileNames.map(({ id }) =>
      fetch(`data/${id}.json`).then((response) => response.json())
    );

    Promise.all(allPromises).then((json) => {
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
  }, []);

  const ready = state !== initialState;

  return (
    <>
      {/* <MainContainer> */}
      {!ready ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border m-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <AppContextProvider initialDropdowns={state}>
          <Dashboard></Dashboard>
        </AppContextProvider>
      )}
      {/* </MainContainer> */}
    </>
  );
};

export default App;
