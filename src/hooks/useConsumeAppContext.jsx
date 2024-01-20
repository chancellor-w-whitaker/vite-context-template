import { useContext } from "react";

import { AppContext } from "../AppContext";

export const useConsumeAppContext = () => useContext(AppContext);
