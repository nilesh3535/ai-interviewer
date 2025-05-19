import Footer from '@/components/Footer';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getTransactionsByUserId } from '@/lib/actions/general.action';
import React from 'react';

export default async function Page() {
  const user = await getCurrentUser();
  const transactions = await getTransactionsByUserId(user.id as string);

  return (
   <div className="">
      {/* Main content */}
      <main className="flex-grow">
    <section className="flex flex-col gap-6 mt-8">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-3xl">Transactions</h2>
      </div>

      {transactions.length === 0 ? (
  <p className="text-gray-500">No transactions found.</p>
) : transactions?.length ? (
  <div className="grid gap-4">
    {transactions.map((tx) => (
      <div
        key={tx.id}
        className="border border-gradient p-0.5 rounded-2xl w-full"
      >
      
      <div className="lg:flex w-full min-h-20 px-5 py-4 rounded-2xl bg-gradient-to-b from-[#1A1C20] to-[#08090D] text-white flex-wrap">

  {/* Order & Date */}
  <div className="flex flex-row lg:justify-between lg:w-[35%] md:w-[100%] justify-between mb-4 lg:mb-0">
    <div>
    <p className="mb-2 text-gray-500 text-xs">{tx.orderid}</p>
    <p className="text-gray-100 text-[15px]">
      {new Date(tx.createdAt).toLocaleString()}
    </p>
    </div>
      <div className="text-gray-600 text-xs">
      <p className="mb-2 text-gray-600 text-xs">Pack</p>
      {tx.type=="Credited"?
      <div className='flex align-middle gap-2'>
      <p className="text-gray-100 text-[15px]">
        @ ₹{Number(tx.amount) / Number(tx.packs)}/interview
      </p>
      <p className={`text-[15px] ${tx.packType=="Gold"?"bg-yellow-500 text-gray-700 font-semibold px-1 rounded":"bg-gray-500 font-semibold px-1 rounded"}`}>{tx.packType}</p>
      </div>:<p className="text-gray-100 text-[15px]"></p>
       }
    </div>
  </div>
  <div className="w-[5%] hidden lg:block"></div>

  {/* Price, Paid, Payment Type */}
  <div className="flex flex-row lg:justify-around lg:w-[30%] md:w-[100%] justify-between mb-4 lg:mb-0">
  

    <div className="text-gray-600 text-xs">
      <p className="mb-2 text-gray-600 text-xs">Paid</p>
      <p className="text-gray-100 text-[15px]">{tx.type=="Credited"? "₹"+tx.amount :"" }</p>
   
    </div>

    <div className="text-gray-600 text-xs">
      <p className="mb-2 text-gray-600 text-xs">Payment</p>
      <p className="text-xs text-blue-600 font-bold italic">
        {tx.paymentType.toUpperCase()}
      </p>
    </div>
  </div>

  {/* Spacer (optional) */}
  <div className="w-[10%] hidden lg:block"></div>

  {/* Packs and Remaining */}
  <div className="flex flex-row lg:justify-between lg:w-[20%] md:w-[100%] justify-between mb-4 lg:mb-0">
    {/* Packs */}
    <div className="flex flex-col">
      <div className="flex flex-row items-center gap-2">
        <p className={`font-semibold text-lg ${tx.type=="Credited"? "text-green-400":"text-red-400"}`}>
          {tx.type === "Credited" ? "+" : "-"} {tx.packs}
        </p>
        <p className="text-gray-200 text-[12px]">
          {tx.packs === "1" ? "Pack" : "Pack's"}
        </p>
      </div>
      <p className="text-xs text-gray-500 text-center italic">{tx.type}</p>
    </div>

    {/* Remaining */}
    <div className="flex flex-col">
      <div className="flex flex-row items-center gap-2">
        <p className="font-semibold text-[#fdcc03] text-lg">
          {tx.remaining === "" ? "0" : tx.remaining}
        </p>
        <p className="text-gray-200 text-[12px]">
          {tx.remaining === "" ? "Interview" : "Interview's"}
        </p>
      </div>
      <p className="text-xs text-gray-500 text-center italic">Total</p>
    </div>
  </div>
</div>


      </div>
    ))}
  </div>
) : null}
     
    </section>
    </main>
   
    </div>  
  );
}
