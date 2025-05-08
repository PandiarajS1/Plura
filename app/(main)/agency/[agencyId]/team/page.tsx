import { db } from "@/lib/db";
import React from "react";
import DataTable from "./data-table";
import { Plus } from "lucide-react";
import columns from "./columns";
import { currentUser } from "@clerk/nextjs";

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
        <>
          <Plus size={15} />
          add
        </>
      }
      data={teamMembers}
      modalChildren={<></>}
      filterValue="name"
      columns={columns}
    />
  );
};

export default TeamPage;
