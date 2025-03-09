import React from "react";

const page = async (props: { params: Promise<{ agencyId: string }> }) => {
  const params = await props.params;
  return <div></div>;
};

export default page;
