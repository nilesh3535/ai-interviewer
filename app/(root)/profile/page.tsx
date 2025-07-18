import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Metadata } from "next";
import React from "react";

import { isAuthenticated, getCurrentUser } from "@/lib/actions/auth.action";
import { ArrowLeft } from "lucide-react";
export const metadata: Metadata = {
  title:
  "AI  Interviewer - Admin Panel",
description: "This is AI  Interviewer - Admin Panel",};

export default async function Profile() {
  const user = await getCurrentUser();


  return (
    <div>
       <a
         href='https://app.winyourinterview.ai/'
          className="w-fit flex flex-row items-center cursor-pointer mb-2"
        >
          <ArrowLeft color="#ffffffc2" size={21} />
          <p className="text-[#ffffffc2] ml-1">Go Back</p>
        </a>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard user={user} />
          <UserInfoCard user={user} />
          <UserAddressCard user={user} />
        </div>
      </div>
    </div>
  );
}
