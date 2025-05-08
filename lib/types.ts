import { Role, Notification, Prisma } from "@prisma/client";
import { getAuthUserDetails, getUserPermissions } from "./queries";
import { db } from "./db";

const __getUserWithAgencySubAccountsPermissionsSidebaroptions = async (
  agencyId: string,
) => {
  return await db.user.findFirst({
    where: {
      Agency: {
        id: agencyId,
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
};
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

export type UsersWithAgencySubAccountPermissionsSidebaroptions =
  Prisma.PromiseReturnType<
    typeof __getUserWithAgencySubAccountsPermissionsSidebaroptions
  >;
