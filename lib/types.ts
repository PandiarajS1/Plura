import { Role, Notification, Prisma } from "@prisma/client";
import { getAuthUserDetails, getUserPermissions } from "./queries";

export type NotificationWithUser =
  | ({
      id: string;
      name: string;
      avatarUrl: string;
      email: string;
      createdAt: Date;
      updatedAt: Date;
      role: Role;
      agencyId: string | null;
    } & Notification)[]
  | [];

export type UserWithPermissionAndSubAccount = Prisma.PromiseReturnType<
  typeof getUserPermissions
>;

export type AuthUserWithAgencySidebarOptionsSubAccounts =
  Prisma.PromiseReturnType<typeof getAuthUserDetails>;
