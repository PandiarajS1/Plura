import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { CheckCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
// import android from @/public/assets/Android

type Props = {
  params: {
    agencyId: string;
  };
  searchParams: {
    code: string;
  };
};

const LaunchPad = async ({ params, searchParams }: Props) => {
  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
  });

  if (!agencyDetails) return;

  const allDetailsExist =
    agencyDetails.address &&
    agencyDetails.agencyLogo &&
    agencyDetails.companyEmail &&
    agencyDetails.companyPhone &&
    agencyDetails.name &&
    agencyDetails.city &&
    agencyDetails.zipcode &&
    agencyDetails.state &&
    agencyDetails.country;

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="h-full w-full max-w-[800px]">
        <Card className="border-none">
          <CardHeader>
            <CardTitle>Lets get started!</CardTitle>
            <CardDescription>
              follow the steps below to get your account setup correctly
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between w-full border p-6 rounded-lg gap-2">
              <div className="flex md:items-center gap-4 flex-col md:!flex-row ">
                <div className="flex gap-4">
                  <Image
                    src={"/assests/android1.png"}
                    alt="android"
                    height={30}
                    width={30}
                    className="rounded-md object-contain"
                  />
                  <Image
                    src={"/assests/ios.png"}
                    alt="ios"
                    height={30}
                    width={30}
                    className="dark:px-0 dark:py-0 dark:bg-transparent dark:rounded-none rounded-full object-contain bg-black/30 px-1 py-1"
                  />
                </div>
                <p>Save the website as a shortcut on your mobile device</p>
              </div>
              <Button>Start</Button>
            </div>
            <div className="flex items-center justify-between w-full border p-6 rounded-lg gap-2">
              <div className="flex md:items-center gap-4 flex-col md:!flex-row ">
                <Image
                  src={"/assests/stripe.png"}
                  alt="stripe"
                  height={60}
                  width={60}
                  className="rounded-md object-contain"
                />
                <p>
                  connect your stripe account to accept payments and see your
                  dashboard
                </p>
              </div>
              <Button>Start</Button>
            </div>
            <div className="flex items-center justify-between w-full border p-6 rounded-lg gap-2">
              <div className="flex md:items-center gap-4 flex-col md:!flex-row ">
                <Image
                  src={agencyDetails.agencyLogo}
                  alt="agencyLogo"
                  height={60}
                  width={60}
                  className="rounded-md object-contain"
                />
                <p>fill in all your agency details to get started</p>
              </div>
              {allDetailsExist ? (
                <CheckCircleIcon
                  size={50}
                  className="text-primary p-2 flex-shrink-0"
                />
              ) : (
                <Link
                  className="bg-primary font-medium text-white py-[6px] px-4 rounded-lg hover:bg-primary/80"
                  href={`/agency/${params.agencyId}/settings`}
                >
                  Start
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LaunchPad;
