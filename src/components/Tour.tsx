import React, { useEffect } from "react";
import { useTourStyles } from "../hooks/useTourStyles";
import { TourProvider, useTour } from "@reactour/tour";
import { tourSteps } from "../services/tour";

type TourProps = {
  children: React.ReactNode;
};

const Tour = ({ children }: TourProps) => {
  const { setIsOpen } = useTour();
  const tourStyles = useTourStyles();

  useEffect(() => {
    setIsOpen(true);
  }, [setIsOpen]);
  return (
    <TourProvider steps={tourSteps} styles={tourStyles} defaultOpen={true}>
      {children}
    </TourProvider>
  );
};

export default Tour;
