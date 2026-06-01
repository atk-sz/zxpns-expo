import ScreenView from "@/components/generic/ScreenView";
import LoaderComponent from "@/components/loader/loader.component";
import React from "react";

const InitLoadScreen: React.FC = () => {
  return (
    <ScreenView>
      <LoaderComponent />
    </ScreenView>
  );
};

export default InitLoadScreen;
