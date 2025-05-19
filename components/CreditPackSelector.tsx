'use client';


import { cn } from '@/lib/utils';
import { Star, StarHalf } from 'lucide-react';
import Image from 'next/image';
import Script from 'next/script';
import { toast } from 'sonner';
import { redirect } from "next/navigation";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { HelpCircle,LaptopMinimalCheck   } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const PACKS = [
  { packs: 1, amount: 1000,pack:"Silver",offer:"0%", desc:"Perfect for first-timers. Give one interview and explore the experience. A simple, no-frills way to get started." },
  { packs: 5, amount: 4500 ,pack:"Gold",offer:"10%",desc:"Our most popular and value-packed option. Access up to five interviews with expanded reach. Ideal for those actively exploring opportunities." },
  { packs: 10, amount: 8000 ,pack:"Platinum",offer:"20%",desc:"Designed for ambitious job seekers. Unlock ten interviews for maximum exposure.Your best chance to land the perfect role." },
];

export default function CreditPackSelector({user,packsData}) {
 const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    setCountdown(5);
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
       toast.success("🎉 Wallet updated ");
       window.location.href = "/transactions";
      return;
    }

    timerRef.current = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [countdown]);
   const accept = () => {
      toast.success("🎉 Wallet updated ");
      window.location.href = "/transactions"; // Full reload
    };

    const reject = () => {
        
    };

    const confirmPayment = () => {
        handleClick()
        confirmDialog({
            group: 'headless',
            message: '',
            header: 'Payment successful',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept,
            reject
        });
    };

  const handleBuy = async (packs: number, amount: number,pack:string) => {
    const res = await fetch('api/razorpay/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packs, amount:1 }),
    });

    const order = await res.json();

    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: 1,
        currency: order.currency,
        name: 'AI Interviewer',
        description: `${packs} Interview Packs`,
        image: '/logo_old.svg', // 👈 Your logo path (should be publicly accessible)
        order_id: order.id,
      handler: async function (response: any) {
        console.log(`✅ Payment successful: ${response.razorpay_payment_id}`);

        try {
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              userId: user?.id || "",
              packs,
              amount,
              oldBalance:user?.packs||0,
              packType:pack
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            toast.loading("🎉 Payment successful! Updating your wallet.",{
            duration: 5000,
            id: "feedback-toast"
          });
          confirmPayment()
          //  setTimeout(()=>{
          //     toast.success("🎉 Wallet updated ")
          //   window.location.href = "/transactions"; // Full reload
          //  },5000)
          } else {
            toast.error("⚠️ Payment succeeded but could not verify.");
          }
        } catch (err) {
          console.error("Error verifying payment", err);
          toast.error("❌ Failed to verify payment. Please contact support.");
        }
      },
        prefill: {  
          name: user?.name||"",
          email: user?.email||"",
          contact: user?.phone||"",
        },
        theme: { color: '#6366f1' },
        modal: {
          ondismiss: function () {
            // This is triggered when user closes the Razorpay modal
           
            toast.error("Payment cancelled by user.");
            console.warn("⚠️ Razorpay modal was dismissed.");
          }
        }
      };

    const rzp = new (window as any).Razorpay(options);
  
    rzp.open();
  };

  return (
    <>

      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
     <ConfirmDialog
  group="headless"
  content={({ headerRef, contentRef, footerRef, hide, message }) => (
    <div className="flex flex-col items-center px-10 py-5 bg-white shadow-xl shadow-gray-500 rounded-lg max-w-md mx-auto">
      <div className="bg-green-500 text-white rounded-full p-5 -mt-12">
        <LaptopMinimalCheck  size={30} className="text-gray-50" />
      </div>
      <h2 ref={headerRef} className="text-gray-700 font-semibold text-2xl mt-4">
        {message.header}
      </h2>
      <p className="text-gray-500 text-lg text-center mt-5">
       Updating your wallet.
       
      </p>
     
    
      <div ref={footerRef} className="w-full flex flex-row justify-around mt-6">
        <button
          type="button"
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 font-medium rounded-lg text-sm px-8 py-2.5 text-center me-2 mb-2"
          onClick={(e) => {
            hide(e);
            accept();
          }}
        >
          Refresh Manually
        </button>
       
      </div>
       {countdown!==null && <p ref={contentRef} className="mt-8 text-gray-700 text-center italic">
        Automatically refreshing in {countdown} second{countdown !== 1 ? 's' : ''}...
      </p>}
    </div>
  )}
/>
      <section className="mt-8 flex flex-col items-center gap-9">
        <h2 className="text-3xl">Select your Interview Pack</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 md:grid md:flex">
        {packsData.map((pack) => (
            <div
                key={pack.id}
                className={`relative w-[350px] max-sm:w-full min-h-110  rounded-xl px-6 py-5 shadow-sm flex flex-col justify-between transition 
                  ${pack.name == "Gold" ? 
                  "hover:border-[#05ae96] border-8 border-[#efc744] bg-gradient-to-b from-[#ffffff] to-[#ffffff]" 
                  : pack.name == "Silver" ? "hover:border-gray-500 border-3 border-gray-50 bg-gradient-to-b from-[#dfdede] to-[#e6e6e6]"
                  :"hover:border-[#856d5f] border-3 border-gray-50 bg-gradient-to-b from-[#dfdede] to-[#e6e6e6]"
                }`}
                  
              >
              <div
                          className={
                            `absolute top-0 left-0 w-1/2 px-4 py-2 rounded-tl-lg rounded-br-lg z-10`}
                            style={{
              background: pack.name === "Gold"
                ? "linear-gradient(to bottom, #efc744, #fffbc5, #efc744)":
                pack.name === "Silver"?"linear-gradient(to bottom, #7f7e7a, #e3e1e2, #7f7e7a)"
                : "linear-gradient(to bottom, #cda58d, #ffe8dc, #cda58d)"
            }}
                        >
                          <p className={`badge-text text-4xl font-semibold text-[#000000]
                          `}>
                            {pack.name}
                            </p>
                            
                        </div>
                         <div
                          className={cn( "absolute top-[-18] right-0"  )}
                        >
                         {pack.name=="Gold" && (
                          <Image
                          alt='best choice' 
                           src={"/bestc.png"}
                           width={"130"}
                           height={"80"}
                           className=''
                           />
                         )}
                           
                          </div>
                

            <div className="mt-20 mb-4">
                <h3 className="text-3xl font-semibold text-black">
                {pack.packs} Interview{pack.packs > 1 ? 's' : ''}
                </h3>
                <div className='flex justify-between items-center mt-2'>
                <p className="text-gray-700 text-lg mt-0  ">
               
                @ ₹{Math.floor(pack.amount / pack.packs)} per interview
           
                </p>
                <p className={`text-right text-lg text-white px-2 py-1 rounded-3xl font-semibold ${pack.offer!=="0" && "bg-green-500 "}`}>
                  
                  {pack.offer!=="0" ? "Save "+pack.offer+"%" :""}</p>
                  </div>
                <div className='mt-5'>
               
                <p className='text-gray-700 text-xl mb-5' >{pack.desc}</p>
           
            </div>
            </div>

            <button
          //onClick={()=>{confirmPayment()}}
                onClick={() => handleBuy(pack.packs, pack.amount,pack.name)}
                className="bg-indigo-600 text-white py-2 text-xl font-semibold rounded-lg mt-auto hover:bg-indigo-700 transition cursor-pointer"
            >
                Buy Now
            </button>
            <div className='flex flex-row'>
            <p className="text-center text-gray-500 w-1/3"></p>
            <p className="text-center text-gray-500 w-1/3">Pay ₹{pack.amount}</p>
            {/* <p className="text-right text-[#05ae96] font-semibold w-1/3">{pack.offer ? "Save "+pack.offer :""}</p> */}
            </div>
            </div>
        ))}
        </div>
      </section>
    </>
  );
}
