import Link from "next/link";
import React from "react";

type Props = {};

const Unauthorized = (props: Props) => {
  return (
    <div
      className="flex justify-center items-center
    h-screen p-4 w-screen flex-col"
    >
      <h1 className="text-3xl md:text-6xl">Unauthorized access!</h1>
      <p className="">
        Please contact support or your agency owner to get access
      </p>
      <Link href="/" className="mt-4 bg-primary p-2 rounded-md">
        Back to home
      </Link>
    </div>
  );
};

export default Unauthorized;
