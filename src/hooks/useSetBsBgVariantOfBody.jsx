import { useLayoutEffect } from "react";

export const useSetBsBgVariantOfBody = (variant = "body-tertiary") => {
  useLayoutEffect(() => {
    document.body.classList.add(`bg-${variant}`);

    return () => {
      document.body.classList.remove(`bg-${variant}`);
    };
  }, [variant]);
};
