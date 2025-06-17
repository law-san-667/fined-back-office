import React from "react";
import IsLoading from "./is-loading";

type IsLoadingScreenProps = {};

const IsLoadingScreen: React.FC<IsLoadingScreenProps> = ({}) => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <IsLoading className="size-8 text-primary" />
    </div>
  );
};

export default IsLoadingScreen;
