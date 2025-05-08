import Sidebar from "@/components/sidebar";
import Unauthorized from "@/components/unauthorized";
import BlurPage from "@/globals/blur-page";
import InfoBar from "@/globals/infobar";
import {
  verifyAndAcceptInvitation,
  getNotificationAndUser,
} from "@/lib/queries";
import { ClerkProvider, currentUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: { agencyId: string };
};

const layout = async ({ children, params }: Props) => {
  const agencyId = await verifyAndAcceptInvitation();

  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  if (!agencyId) {
    return redirect("/agency");
  }

  if (
    (user.privateMetadata.Role as { role: string }).role !== "AGENCY_OWNER" &&
    (user.privateMetadata.Role as { role: string }).role !== "AGENCY_ADMIN"
  )
    return <Unauthorized />;

  let allNoti: any = [];

  const notifications = await getNotificationAndUser(agencyId);
  if (notifications) allNoti = notifications;

  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <div className="h-screen overflow-hidden">
        <Sidebar id={params.agencyId} type="agency" />
        <div className="md:pl-[300px]">
          <InfoBar notifications={allNoti} />
          <div className="relative">
            <BlurPage>{children}</BlurPage>
          </div>
        </div>
      </div>
    </ClerkProvider>
  );
};

export default layout;
