import dynamic from "next/dynamic";
import React from "react";

// Dynamically import the component, specifying that it should not be SSR.
const ResumeChecker = dynamic(() => import("./ResumeCheckerContent"), {});

export default function ResumeCheckerPage() {
  return <ResumeChecker />;
}
