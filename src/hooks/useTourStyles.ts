import { useMemo } from "react";
import { createTourStyles } from "../services/tour";
import { useStore } from "../store";

export const useTourStyles = () => {
  const themeSelection = useStore((state) => state.theme);

  return useMemo(() => {
    return createTourStyles(themeSelection);
  }, [themeSelection]);
};
