import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { permission } from "process";
import React from "react";

type Props = {};

export const columns: ColumnDef<UsersWithAgencySubAccountPermissionsSidebaroptions>[] =
  [
    {
      accessorKey: "id",
      header: "",
      cell: () => {
        return null;
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const avatarUrl = row.getValue("avatarUrl") as string;
        return (
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 relative flex-none">
              <Image
                src={avatarUrl}
                alt="avatar"
                className="rounded-full object-cover"
                fill
              />
            </div>
            <span>{row.getValue("name")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "avatarUrl",
      header: "",
      cell: () => {
        return null;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "SubAccounts",
      header: "Owned Accounts",
      cell: ({ row }) => {
        const isAgency =
          row.getValue("role") === "AGENCY_OWNER" ||
          row.getValue("role") === "AGENCY_ADMIN";
        const owmnedAccounts = row.original?.Permissions.filter(
          (per) => per.access === true,
        );

        if (isAgency) {
          return (
            <div className="flex flex-col items-start">
              <div className="flex flex-col gap-2">
                <Badge className="bg-slate-600 whitespace-nowrap">
                  Agency -{row?.original?.Agency?.name}
                </Badge>
              </div>
            </div>
          );
        }
        return (
          <div className="flex flex-col items-start">
            <div className="flex flex-col gap-2">
              {owmnedAccounts?.map((acc) => (
                <Badge className="bg-slate-600 w-fit whitespace-nowrap">
                  {acc.SubAccount?.name}
                </Badge>
              ))}
            </div>
          </div>
        );
      },
    },
  ];
