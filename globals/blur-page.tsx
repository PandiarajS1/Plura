import React from "react";

type Props = {
  children: React.ReactNode;
};

const BlurPage = ({ children }: Props) => {
  return (
    <div className="h-screen overflow-scroll absolute top-0 left-0 right-0 bottom-0 z-[11] backdrop-blur-[35px] bg-muted/60 dark:bg-muted/40 dark:shadow-2xl dark:shadow-black mx-auto p-4 pt-24">
      {children}
    </div>
  );
};

export default BlurPage;
