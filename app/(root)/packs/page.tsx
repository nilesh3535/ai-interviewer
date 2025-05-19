
import React from "react";

import { isAuthenticated, getCurrentUser } from "@/lib/actions/auth.action";
import CreditPackSelector from "@/components/CreditPackSelector";
import Footer from "@/components/Footer";
import { getAllPacks } from "@/lib/actions/general.action";

export default async function Profile() {
  const user = await getCurrentUser();
  const packs=await getAllPacks()

  return (
    <div>
     <CreditPackSelector user={user} packsData={packs} />
       <Footer />
    </div>
  );
}
