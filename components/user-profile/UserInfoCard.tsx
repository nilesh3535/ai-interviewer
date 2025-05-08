"use client";
import React from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/buttons/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { toast } from "sonner";
import { updateUserProfile } from "@/lib/actions/auth.action";

export default  function UserInfoCard({user}) {

  const [isOpen,setIsOpen] = React.useState(false);
  const openModal= () => {
    setIsOpen(true);
  }
  const closeModal= () => {
    setIsOpen(false);
    setFirstName(user?.name.trim().split(" ")[0]);
    setLastName(user?.name.trim().split(" ").slice(1).join(" "));
    setEmail(user?.email);
    setPhone(user?.phone || "");
    setBio(user?.bio || "Student");
    setLinkedin(user?.linkedin || "");
    setGstin(user?.gstin || "");
    setCompany(user?.company || "");
  }

  const handleSave = async() => {
    if (!firstName  ) {
      toast.error("First name is required");
      return;
      }else if(!lastName ){
        toast.error("Last name is required");
        return;
      }else if(!email ){
        toast.error("Email is required");
        return;
      }
      const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/.*$/;

      if (linkedin && !linkedinRegex.test(linkedin)) {
        toast.error("Please enter a valid LinkedIn profile URL");
        return;
      }

    toast.loading("Please wait while updating information...", {
      duration: 5000,
      id: "feedback-toast"
    });
   // Update the user's avatar in the database
       try {
         const result = await updateUserProfile({
            userId: user?.id,
            firstName,
            lastName,
            email,
            phone,
            bio,
            linkedin,
            gstin,
            company
         });
         
         if (result.success) {
           toast.success("Information updated successfully!");
           closeModal();
         } else {
           toast.error("Failed to update Information..");
         }
       } catch (error) {
         console.error("Failed to update Information:", error);
         toast.error("Failed to update Information..");
       }
 
  };
  const [firstName, setFirstName] = React.useState(user?.name.trim().split(" ")[0]);
  const [lastName, setLastName] = React.useState(user?.name.trim().split(" ").slice(1).join(" "));
  const [email, setEmail] = React.useState(user?.email);
  const [phone, setPhone] = React.useState(user?.phone || "");
  const [bio, setBio] = React.useState(user?.bio || "Student");
  const [gstin, setGstin] = React.useState(user?.gstin || "");
  const [linkedin, setLinkedin] = React.useState(user?.linkedin || "");
  const [company, setCompany] = React.useState(user?.company || "");
  const handleLinkedInClick = () => {
    if (linkedin) {
      // If the LinkedIn URL is provided, open it in a new tab
      window.open(linkedin, "_blank");
    } else {
      // If the URL is not provided, show an error toast
      toast.error("LinkedIn URL not provided");
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                First Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
               {firstName}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Last Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {lastName}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {phone || "-"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Bio
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
               {bio || "Student"}
              </p>
            </div>
            <div className="flex flex-row items-center gap-2">
            <button
                    onClick={handleLinkedInClick}
                    className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-[#2d64bc] text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-[#2d64bc] dark:text-white dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.78381 4.16645C5.78351 4.84504 5.37181 5.45569 4.74286 5.71045C4.11391 5.96521 3.39331 5.81321 2.92083 5.32613C2.44836 4.83904 2.31837 4.11413 2.59216 3.49323C2.86596 2.87233 3.48886 2.47942 4.16715 2.49978C5.06804 2.52682 5.78422 3.26515 5.78381 4.16645ZM5.83381 7.06645H2.50048V17.4998H5.83381V7.06645ZM11.1005 7.06645H7.78381V17.4998H11.0672V12.0248C11.0672 8.97475 15.0422 8.69142 15.0422 12.0248V17.4998H18.3338V10.8914C18.3338 5.74978 12.4505 5.94145 11.0672 8.46642L11.1005 7.06645Z"
                        fill=""
                      />
                    </svg>
               </button>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {linkedin}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Company (Optional)
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
               {company || "-"}
              </p>
            </div>
            <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  GSTIN (Optional)
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {gstin || "-"}
                </p>
                </div>
            <div className="flex flex-row items-center gap-2">
             
            
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

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              
              <div className="mt-1">
                

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>First Name</Label>
                    <Input type="text" defaultValue={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Last Name</Label>
                    <Input type="text" defaultValue={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email Address</Label>
                    <Input type="text" defaultValue={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone</Label>
                    <Input type="text" defaultValue={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Bio</Label>
                    <Input type="text" defaultValue={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="e.g Student, Developer, etc."
                    />
                  </div>
                
                  <div className="col-span-2">
                    <Label>Linkedln Profile link</Label>
                    <Input type="text" defaultValue={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="Paste your Linkedln Profile link"
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Company (optional)</Label>
                    <Input type="text" defaultValue={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Company name"
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>GSTIN (optional)</Label>
                    <Input type="text" defaultValue={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      placeholder="GSTIN"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
