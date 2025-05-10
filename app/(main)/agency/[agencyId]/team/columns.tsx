"use client";

import UserDetails from "@/components/Forms/user-details";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomModal from "@/globals/custom-modal";
import { useToast } from "@/hooks/use-toast";
import { deleteUser, getUser } from "@/lib/queries";
import { UsersWithAgencySubAccountPermissionsSidebaroptions } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { Role } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { Copy, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

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
        const owmnedAccounts = row.original?.permissions.filter(
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
              {owmnedAccounts?.length ? (
                <>
                  {owmnedAccounts?.map((acc) => (
                    <Badge
                      key={acc.id}
                      className="bg-slate-600 w-fit whitespace-nowrap"
                    >
                      <span>{acc.SubAccount?.name}</span>
                    </Badge>
                  ))}
                </>
              ) : (
                <div className="text-muted-foreground">No Access Yet</div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role: Role = row.getValue("role");
        return (
          <Badge
            className={clsx({
              "bg-green-500": role === "AGENCY_OWNER",
              "bg-slate-400": role === "AGENCY_ADMIN",
              "bg-primary": role === "SUBACCOUNT_USER",
              "bg-muted": role === "SUBACCOUNT_GUEST",
            })}
          >
            {role}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const rowData = row.original;
        return <CellActions rowData={rowData} />;
      },
    },
  ];

interface CellActionsProps {
  rowData: UsersWithAgencySubAccountPermissionsSidebaroptions;
}

const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  const { data, setOpen } = useModal();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  if (!rowData) return;
  if (!rowData.Agency) return;

  return (
    <AlertDialog>
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => {
                navigator.clipboard.writeText(rowData?.email);
              }}
            >
              <Copy size={15} />
              Copy Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => {
                setOpen(
                  <CustomModal
                    subHeading="You can change permissions only when the user has an owned subAccount"
                    title="Edit User Details"
                  >
                    <UserDetails
                      type="agency"
                      id={rowData?.Agency?.id || ""}
                      subAccounts={rowData?.Agency?.SubAccount || []}
                    />
                  </CustomModal>,
                  async () => {
                    return { user: await getUser(rowData?.id) };
                  },
                );
              }}
            >
              <Edit size={15} />
              Edit Details
            </DropdownMenuItem>
            {rowData?.role === "AGENCY_OWNER" && (
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="flex gap-2">
                  <>
                    <Trash2 size={15} />
                    Remove User
                  </>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you Absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user and related data
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={loading}
              className="bg-destructive hover:bg-destructive"
              onClick={async () => {
                setLoading(true);
                await deleteUser(rowData.id);
                toast({
                  title: "User Deleted",
                  description:
                    "User has been deleted from the agency they no longer have access to the agency",
                });
                setLoading(false);
                router.refresh();
              }}
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </>
    </AlertDialog>
  );
};
