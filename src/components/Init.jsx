import { useEffect } from "react";
import { useState } from "react";

import { getRowsAndColumns } from "../functions/getRowsAndColumns";
import { findNextDropdowns } from "../functions/findNextDropdowns";
import { adjustDropdowns } from "../functions/adjustDropdowns";
import { fileNames } from "../constants/fileNames";
import { AppContextProvider } from "../AppContext";
import App from "../App";

const initialState = {};

export const Init = () => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const allPromises = fileNames.map(({ id }) =>
      fetch(`data/${id}.json`).then((response) => response.json())
    );

    Promise.all(allPromises).then((json) => {
      const data = json.flat();

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
      {ready && (
        <AppContextProvider initialDropdowns={state}>
          <App />
        </AppContextProvider>
      )}
    </>
  );
};
