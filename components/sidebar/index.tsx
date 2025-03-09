import { getAuthUserDetails } from "@/lib/queries";
import React from "react";
import MenuOptions from "./menu-options";

type Props = {
  id: string;
  type: "agency" | "subaccount";
};

const Sidebar = async ({ id, type }: Props) => {
  const user = await getAuthUserDetails();
  if (!user) return null;

  if (!user.Agency) return;

  const details =
    type === "agency"
      ? user?.Agency
      : user?.Agency.SubAccount.find((subaccount) => subaccount.id === id);

  const isWhiteLabeledAgency = user.Agency.whiteLabel;
  if (!details) return;

  let sideBarLogo = user.Agency.agencyLogo || "/assets/logo.png";

  if (!isWhiteLabeledAgency) {
    if (type === "subaccount") {
      sideBarLogo =
        user?.Agency.SubAccount.find((subaccount) => subaccount.id)
          ?.subAccountLogo ||
        user.Agency.agencyLogo ||
        "/assets/logo.png";
    }
  }

  const sidebarOption =
    type === "agency"
      ? user.Agency.SideBarOption || []
      : user.Agency.SubAccount.find((subaccount) => subaccount.id === id)
          ?.SideBarOption || [];

  const subaccounts = user.Agency.SubAccount.filter((subaccount) =>
    user.permissions.find(
      (permission) =>
        permission.subAccountId === subaccount.id && permission.access,
    ),
  );

  return (
    <>
      <MenuOptions
        defaultOpen={true}
        details={details}
        id={id}
        sidebarLogo={sideBarLogo}
        sidebarOption={sidebarOption}
        subAccounts={subaccounts}
        user={user}
      />
      <MenuOptions
        details={details}
        id={id}
        sidebarLogo={sideBarLogo}
        sidebarOption={sidebarOption}
        subAccounts={subaccounts}
        user={user}
      />
    </>
  );
};

export default Sidebar;
