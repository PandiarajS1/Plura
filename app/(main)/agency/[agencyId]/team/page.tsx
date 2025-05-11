import { db } from "@/lib/db";
import React from "react";
import DataTable from "./data-table";
import { Plus } from "lucide-react";
import { currentUser } from "@clerk/nextjs";
import { columns } from "./columns";
import SentInvitation from "@/components/Forms/send-invitation";
import { Button } from "@/components/ui/button";

type Props = {
  params: {
    agencyId: string;
  };
};

const TeamPage = async ({ params }: Props) => {
  const authUser = await currentUser();
  const teamMembers = await db.user.findMany({
    where: {
      Agency: {
        id: params.agencyId,
      },
    },
    include: {
      Agency: {
        include: {
          SubAccount: true,
        },
      },
      permissions: {
        include: {
          SubAccount: true,
        },
      },
    },
  });

  if (!authUser) return null;
  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    include: {
      SubAccount: true,
    },
  });

  if (!agencyDetails) return;

  return (
    <DataTable
      actionButtonText={
        <Button>
          <Plus size={15} />
          add
        </Button>
      }
      data={teamMembers}
      modalChildren={<SentInvitation agencyId={agencyDetails.id} />}
      filterValue="name"
      columns={columns}
    />
  );
};

export default TeamPage;
