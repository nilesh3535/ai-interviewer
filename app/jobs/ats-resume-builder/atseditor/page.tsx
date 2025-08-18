import dynamic from "next/dynamic";
import React from "react";

// Dynamically import the component, specifying that it should not be SSR.
const ResumeEditor = dynamic(() => import("./ResumeEditorContent"), {});

export default function ResumeEditorPage() {
  return <ResumeEditor />;
}
