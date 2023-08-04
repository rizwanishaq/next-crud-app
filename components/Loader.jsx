import Image from "next/image";
import React from "react";

const Loader = ({ desc }) => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center">
      <div className="w-10 h-10 relative animate-spin">
        <Image alt="logo" fill src="/assets/images/logo.svg" />
      </div>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
};

export default Loader;