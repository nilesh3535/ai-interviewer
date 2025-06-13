"use client";
import React,{useState} from "react";

import Button from "../ui/buttons/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { updateUserAddress } from "@/lib/actions/auth.action";
import { toast } from "sonner";

export default function UserAddressCard({user}) {
    const [isOpen,setIsOpen] = React.useState(false);
    const openModal= () => {
      setIsOpen(true);
    }
    const closeModal= () => {
      setIsOpen(false);
      setAddress(user?.address || "");
      setCity(user?.city || "");
      setState(user?.state || "");
      setZip(user?.zip || "");
      setCountry(user?.country || "");

    }

    const handleSave = async () => {
      const zipRegex = /^\d{6}$/;

      if (zip && !zipRegex.test(zip)) {
        toast.error("Zip code must be exactly 6 digits");
        return;
      }
    
      toast.loading("Please wait while updating information...", {
        duration: 5000,
        id: "feedback-toast",
      });
    
      try {
        const result = await updateUserAddress({
          userId: user?.id,
          address,
          city,
          state,
          zip,
          country,
        });
    
        if (result.success) {
          toast.success("Information updated successfully!");
          closeModal();
        } else {
          toast.error("Failed to update information.");
        }
      } catch (error) {
        console.error("Failed to update information:", error);
        toast.error("Failed to update information.");
      }
    };
    
   const [address, setAddress] = useState(user?.address || "");
    const [city, setCity] = useState(user?.city || "");
    const [state, setState] = useState(user?.state || "");  
    const [zip, setZip] = useState(user?.zip || "");
    const [country, setCountry] = useState(user?.country || "");

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-4">
              Address
            </h4>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Address
                </p>
            <p className="text-sm font-medium text-white/90 mb-5">
                 {address || "-"}
                </p>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Country
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                 {country || "-"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  City
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {city || "-"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                 State
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {state|| "-"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  ZIP Code
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {zip|| "-"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </button>
        </div>
      </div>
     

      {isOpen && (
  <div className="fixed inset-0 flex items-center justify-center overflow-y-auto z-[99999]">
    {/* Backdrop */}
    {!false && (
      <div
        className="fixed inset-0 h-full w-full bg-gray-400/20 backdrop-blur-[5px]"
        onClick={closeModal}
      ></div>
    )}

    {/* Modal Content */}
    <div
      className={`${
        false ? "w-full h-full" : "relative w-full max-w-[700px] m-4 rounded-3xl bg-white dark:bg-gray-900"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      {true && (
        <button
          onClick={closeModal}
          className="absolute right-3 top-3 z-[999] flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Address
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar ">
            <div>
                  <Label>Address</Label>
                  <Input type="text" defaultValue={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="address"
                  
                  />
                </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-5">
                <div>
                  <Label>Country</Label>
                  <Input type="text" defaultValue={country} 
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="country"
                  
                  />
                </div>

                <div>
                  <Label>City</Label>
                  <Input type="text" defaultValue={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="city"

                  />
                </div>

                <div>
                  <Label>State</Label>
                  <Input type="text" defaultValue={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="state"
                   />
                </div>

                <div>
                  <Label>ZIP Code</Label>
                  <Input type="text" defaultValue={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="zip code"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-8 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
            </div>
      </div>
      </div>)}
   
    </>
  );
}
