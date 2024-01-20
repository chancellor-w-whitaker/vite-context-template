import { createContext } from "react";

import { useSetBsBgVariantOfBody } from "./hooks/useSetBsBgVariantOfBody";

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const appContext = useProvideAppContext();

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};

// ! main method
const useProvideAppContext = () => {
  useSetBsBgVariantOfBody("primary-subtle");

  const myName = {
    lastName: "Whitaker",
    firstName: "Chance",
    middleInitial: "W",
  };

  return myName;
};
