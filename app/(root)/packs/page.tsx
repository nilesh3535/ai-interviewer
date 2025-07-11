
import React from "react";

import { isAuthenticated, getCurrentUser } from "@/lib/actions/auth.action";
import CreditPackSelector from "@/components/CreditPackSelector";
import Footer from "@/components/Footer";
import { getAllPacks } from "@/lib/actions/general.action";
import { ArrowLeft } from "lucide-react";

export default async function Profile() {
  const user = await getCurrentUser();
  const packs=await getAllPacks()

  return (
    <div>
       <a
         href='https://app.winyourinterview.ai/'
          className="w-fit flex flex-row items-center cursor-pointer"
        >
          <ArrowLeft color="#ffffffc2" size={21} />
          <p className="text-[#ffffffc2] ml-1">Go Back</p>
        </a>
     <CreditPackSelector user={user} packsData={packs} />
       <Footer />
    </div>
  );
}
