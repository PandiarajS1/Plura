"use client";

import {
  changeUserPermissions,
  getAuthUserDetails,
  getUserPermissions,
  saveActivityLogsNotification,
  updateUser,
} from "@/lib/queries";
import {
  AuthUserWithAgencySidebarOptionsSubAccounts,
  UserWithPermissionAndSubAccount,
} from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubAccount, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FileUpload from "@/globals/file-upload";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SelectItem } from "@radix-ui/react-select";
import { Button } from "../ui/button";
import { Check, Loader2 } from "lucide-react";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { permission } from "process";
import { v4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

type Props = {
  id: string;
  subAccounts: SubAccount[];
  type: "agency" | "subAccount";
  userData?: Partial<User>;
};

const UserDetails = ({ id, subAccounts, type, userData }: Props) => {
  const [subAccountPermissions, setsubAccountPermissions] =
    useState<UserWithPermissionAndSubAccount>(null);

  const { data, setClose } = useModal();
  const [roleState, setroleState] = useState("");
  const [loadingPermissions, setloadingPermissions] = useState(false);
  const [authUserData, setauthUserData] =
    useState<AuthUserWithAgencySidebarOptionsSubAccounts>(null);
  const { toast } = useToast();
  const route = useRouter();

  useEffect(() => {
    if (data.user) {
      const fetchDetails = async () => {
        const response = await getAuthUserDetails();
        if (response) setauthUserData(response);
      };
      fetchDetails();
    }
  }, [data]);

  const userDataSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    avatarUrl: z.string().url(),
    role: z.enum([
      "AGENCY_OWNER",
      "AGENCY_ADMIN",
      "SUBACCOUNT_USER",
      "SUBACCOUNT_GUEST",
    ]),
  });

  const form = useForm<z.infer<typeof userDataSchema>>({
    resolver: zodResolver(userDataSchema),
    mode: "onChange",
    defaultValues: {
      name: userData ? userData.name : data?.user?.name,
      email: userData ? userData.email : data?.user?.email,
      avatarUrl: userData ? userData.avatarUrl : data?.user?.avatarUrl,
      role: userData ? userData.role : data?.user?.role,
    },
  });

  useEffect(() => {
    if (!data.user) return;
    const getPermissions = async () => {
      if (!data.user) return;
      const permission = await getUserPermissions(data.user.id);
      setsubAccountPermissions(permission);
    };
    getPermissions();
  }, [data, form]);

  useEffect(() => {
    if (data.user) form.reset(data.user);

    if (userData) {
      form.reset(userData);
    }
  }, [userData, data]);

  const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
    if (!id) return;
    if (!userData || data?.user) {
      const updatedUser = await updateUser(values);

      authUserData?.Agency?.SubAccount.filter((subAccount) => {
        authUserData.permissions.find(
          (p) => p.subAccountId === subAccount.id && p.access,
        );
      }).forEach(async (subaccount) => {
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Updated ${userData?.name} information`,
          subaccountId: subaccount.id,
        });
      });

      if (updatedUser) {
        toast({
          title: "success",
          description: "updated User Information",
        });
        setClose();
        route.refresh();
      } else {
        toast({
          title: "Oppse!",
          variant: "destructive",
          description: "Could not update user information",
        });
      }
    } else {
      console.log("error could not submit");
    }
  };

  const onChangePermission = async (
    subAccountId: string,
    val: boolean,
    permissionId: string | undefined,
  ) => {
    if (!data.user?.email) return;
    setloadingPermissions(true);
    const response = await changeUserPermissions(
      permissionId ? permissionId : v4(),
      data.user?.email,
      subAccountId,
      val,
    );
    if (type === "agency") {
      await saveActivityLogsNotification({
        agencyId: authUserData?.Agency?.id,
        description: `Save ${data.user?.name} access to | ${
          subAccountPermissions?.permissions.find(
            (p) => p.subAccountId === subAccountId,
          )?.SubAccount.name
        }`,
        subaccountId: subAccountPermissions?.permissions.find(
          (p) => p.subAccountId === subAccountId,
        )?.SubAccount.id,
      });
    }
    if (response) {
      toast({
        title: "success",
        description: "updated User Information",
      });
      if (subAccountPermissions) {
        subAccountPermissions.permissions.find((p) => {
          if (p.subAccountId === subAccountId) {
            return { ...p, access: !p.access };
          }
        });
      }
    } else {
      toast({
        title: "failed",
        variant: "destructive",
        description: "Could not update permissions",
      });
    }
    route.refresh();
    setloadingPermissions(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>Add or Update your information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="avatar"
                      onchange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User full name</FormLabel>
                  <FormControl>
                    <Input required placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User Email</FormLabel>
                  <FormControl>
                    <Input required placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User Role</FormLabel>
                  <Select
                    disabled={field.value === "AGENCY_OWNER"}
                    onValueChange={(value) => {
                      if (
                        value === "SUBACCOUNT_USER" ||
                        value === "SUBACCOUNT_GUEST"
                      ) {
                        setroleState(
                          "you need to have subaccounts to assign Subaccount acess to team memebers",
                        );
                      } else {
                        setroleState("");
                      }
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(data?.user?.role === "AGENCY_OWNER" ||
                        userData?.role === "AGENCY_OWNER") && (
                        <SelectItem value="AGENCY_OWNER">
                          Agency Owner
                        </SelectItem>
                      )}
                      <SelectItem value="AGENCY_ADMIN">Agency Admin</SelectItem>
                      <SelectItem value="SUBACCOUNT_USER">
                        Subaccount User
                      </SelectItem>
                      <SelectItem value="SUBACCOUNT_GUEST">
                        Subaccount Guest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground">{roleState}</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              {form.formState.isSubmitting ? "Saving..." : "Save changes"}
            </Button>
            {authUserData?.role === "AGENCY_OWNER" && (
              <div>
                <Separator className="my-4" />
                <FormLabel>User Permissions</FormLabel>
                <FormDescription className="mb-4">
                  You can give Sub Account access to team member by turning on
                  access control for each sub account. This is only visible to
                  you as Agency Owners
                </FormDescription>
                <div className="flex flex-col gap-4">
                  {subAccounts?.map((subAccount) => {
                    const subAccountPermissionsDetails =
                      subAccountPermissions?.permissions.find(
                        (p) => p.subAccountId === subAccount.id,
                      );
                    return (
                      <div
                        key={subAccount.id}
                        className="flex flex-col items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <p>{subAccount.name}</p>
                        </div>
                        <Switch
                          disabled={loadingPermissions}
                          checked={subAccountPermissionsDetails?.access}
                          onCheckedChange={(permission) => {
                            onChangePermission(
                              subAccount.id,
                              permission,
                              subAccountPermissionsDetails?.id,
                            );
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserDetails;
