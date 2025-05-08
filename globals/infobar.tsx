"use client";

import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { NotificationWithUser } from "@/lib/types";
import { UserButton } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Bell } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";
import { ModeToggle } from "./mode-toggle";

type Props = {
  notifications: NotificationWithUser | [];
  role?: Role;
  className?: string;
  subAccountId?: string;
};

const InfoBar = ({ notifications, role, className, subAccountId }: Props) => {
  const [allNotifications, setAllNotifications] = React.useState(notifications);
  const [showall, setShowAll] = React.useState(true);

  const handleclick = () => {
    if (!showall) {
      setAllNotifications(notifications);
    } else {
      if (notifications.length !== 0) {
        setAllNotifications(
          notifications?.filter((item) => item.subAccountId === subAccountId) ??
            [],
        );
      }
    }
    setShowAll((prev) => !prev);
  };

  return (
    <>
      <div
        className={twMerge(
          "fixed z-[20] md:left-[300px] left-0 right-0 top-0 p-4 bg-background/80 backdrop-blur-md flex gap-4 items-center border-b-[1px]",
          className,
        )}
      >
        <div className="flex items-center gap-2 ml-auto">
          <UserButton />
          <Sheet>
            <SheetTrigger>
              <div className="rounded-full w-9 h-9 bg-primary flex items-center justify-center text-white">
                <Bell size={17} />
              </div>
            </SheetTrigger>
            <SheetContent className="mt-4 mr-4 pr-4 flex flex-col">
              <SheetHeader className="text-left">
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription>
                  {(role === "AGENCY_ADMIN" || "AGENCY_OWNER") && (
                    <Card className="flex items-center justify-between p-4">
                      Current SubAccount
                      <Switch onChangeCapture={handleclick} />
                    </Card>
                  )}
                </SheetDescription>
              </SheetHeader>
              {allNotifications?.map((notification) => (
                <div
                  key={notification.id}
                  className="flex flex-col gap-2 overflow-x-scroll 
                  text-ellipsis"
                >
                  <div className="flex gap-2">
                    <Avatar>
                      <AvatarImage
                        src={notification.avatarUrl}
                        alt="Profile Picture"
                      ></AvatarImage>
                      <AvatarFallback className="bg-primary">
                        {notification.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p>
                        <span className="font-bold">
                          {notification.notification.split("|"[0])}
                        </span>
                        <span className="text-muted-foreground">
                          {notification.notification.split("|"[1])}
                        </span>
                        <span className="font-bold">
                          {notification.notification.split("|"[2])}
                        </span>
                      </p>
                      <small className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
              {allNotifications.length === 0 && (
                <div className="flex items-center justify-center mb-4">
                  You Have No notifications
                </div>
              )}
            </SheetContent>
          </Sheet>
          <ModeToggle />
        </div>
      </div>
    </>
  );
};

export default InfoBar;
