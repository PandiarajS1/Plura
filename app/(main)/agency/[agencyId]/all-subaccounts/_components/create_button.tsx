"use client";

import SubAccountDetails from "@/components/Forms/subaccounts-details";
import { Button } from "@/components/ui/button";
import CustomModal from "@/globals/custom-modal";
import { useModal } from "@/providers/modal-provider";
import { Agency, AgencySidebarOption, SubAccount, User } from "@prisma/client";
import { PlusCircleIcon } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  user: User & {
    Agency:
      | (
          | Agency
          | (null & {
              SubAccount: SubAccount[];
              SidebarOption: AgencySidebarOption[];
            })
        )
      | null;
  };
  id: string;
  className?: string;
};

const CreateButton = ({ user, id, className }: Props) => {
  const { setOpen } = useModal();
  const agencyDetails = user.Agency;

  if (!agencyDetails) return;

  return (
    <Button
      className={twMerge("w-full flex gap-4", className)}
      onClick={() => {
        setOpen(
          <CustomModal
            title="Create SubAccount"
            subHeading="You can switch between"
          >
            <SubAccountDetails
              agencyDetails={agencyDetails}
              userId={user.id}
              userName={user.name}
            />
          </CustomModal>,
        );
      }}
    >
      <PlusCircleIcon size={15} /> Create Sub Account
    </Button>
  );
};

export default CreateButton;
