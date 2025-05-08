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
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getAuthUserDetails } from "@/lib/queries";
import { SubAccount } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import DeleteButton from "./_components/delete-button";
import CreateButton from "./_components/create_button";

type Props = {
  params: {
    agencyId: string;
  };
};

const AllSubAccounts = async ({ params }: Props) => {
  const user = await getAuthUserDetails();
  if (!user) return;

  return (
    <AlertDialog>
      <div className="flex flex-col h-full">
        <CreateButton
          user={user}
          id={params.agencyId}
          className="w-[200px] self-end my-6"
        />
        <Command className="rounded-lg bg-transparent">
          <CommandInput placeholder="Search Account.." />
          <CommandList className="h-full">
            <CommandEmpty>No results found</CommandEmpty>
            <CommandGroup heading="Sub Accounts">
              {!!user.Agency?.SubAccount.length ? (
                user.Agency.SubAccount.map((subaccount: SubAccount) => (
                  <CommandItem
                    key={subaccount.id}
                    className="h-32 flex justify-between !bg-background my-2 text-primary border-[1px] border-border p-4 rounded-lg hover:!bg-background cursor-pointer transition-all"
                  >
                    <Link
                      href={`/subaccounts/${subaccount.id}`}
                      className="flex gap-4 w-ful h-full"
                    >
                      <div className="relative w-32">
                        <Image
                          src={subaccount.subAccountLogo}
                          alt={subaccount.name}
                          fill
                          className="rounded-md object-contain bg-muted/50"
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <div className="flex flex-col">
                          {subaccount.name}
                          <span className="text-muted-foreground text-xs">
                            {subaccount.address}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size={"sm"}
                        className="text-red-600 w-20 hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-left">
                          Are you sure you want to delete?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-left">
                          This action cannot be undone. This will permanently
                          delete the subaccount and all its data related to the
                          subaccount.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex items-center">
                        <AlertDialogCancel className="md-2">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg:bg-destructive">
                          <DeleteButton subAccountId={subaccount.id} />
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </CommandItem>
                ))
              ) : (
                <div className="text-muted-foreground text-center p-4">
                  No Sub accounts
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </AlertDialog>
  );
};

export default AllSubAccounts;
