"use client";

import { Agency, SubAccount } from "@prisma/client";
import React, { useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { useForm } from "react-hook-form";
import FileUpload from "@/globals/file-upload";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import { saveActivityLogsNotification, upsertSubAccount } from "@/lib/queries";
import { Button } from "../ui/button";

import { v4 } from "uuid";
import { useModal } from "@/providers/modal-provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  data?: Partial<Agency>;
};

interface SubAccountDetailsProps {
  agencyDetails: Agency;
  details?: Partial<SubAccount>;
  userId: string;
  userName: string;
}

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "SubAccount name must be atleast 2 character" }),
  companyEmail: z.string(),
  companyPhone: z.string().min(6),
  address: z.string().min(2),
  city: z.string().min(1),
  zipcode: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  SubAccountLogo: z.string().min(1),
});

const SubAccountDetails: React.FC<SubAccountDetailsProps> = ({
  details,
  agencyDetails,
  userId,
  userName,
}) => {
  const { setClose } = useModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: details?.name,
      companyEmail: details?.companyEmail,
      companyPhone: details?.companyPhone,
      address: details?.address,
      city: details?.city,
      zipcode: details?.zipcode,
      state: details?.state,
      country: details?.country,
      SubAccountLogo: details?.subAccountLogo,
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const response = await upsertSubAccount({
        id: details?.id ? details.id : v4(),
        address: values.address,
        subAccountLogo: values.SubAccountLogo,
        city: values.city,
        companyEmail: values.companyEmail,
        companyPhone: values.companyPhone,
        country: values.country,
        name: values.name,
        state: values.state,
        zipcode: values.zipcode,
        createdAt: new Date(),
        updatedAt: new Date(),
        agencyId: agencyDetails.id,
        connectAccountId: "",
        goal: 5000,
      });

      if (!response) throw new Error("No response from server");
      await saveActivityLogsNotification({
        agencyId: response.agencyId,
        description: `${userName} | Created a new sub account | ${response.name}`,
        subaccountId: response.id,
      });

      toast.success("Sub Account details saved", {
        description: "Successfully saved your sub account details",
      });

      setClose();
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Error creating sub account");
    }
  };

  useEffect(() => {
    if (!details?.id) {
      form.reset(details);
    }
  }, [details]);

  const isLoading = form.formState.isSubmitting;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sub Account information</CardTitle>
        <CardDescription>Please enter business details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="SubAccountLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SubAccount Logo</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="subaccountLogo"
                      onchange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex md:flex-row gap-4">
              <FormField
                disabled={isLoading}
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>SubAccount Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                name="companyEmail"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>SubAccount Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex md:flex-row gap-4">
              <FormField
                disabled={isLoading}
                name="companyPhone"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>SubAccount Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Phone no" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              disabled={isLoading}
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="No.65 mgr nagar..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-4">
              <FormField
                disabled={isLoading}
                name="city"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="chennai" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                name="state"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="TN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                name="zipcode"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Zipcode</FormLabel>
                    <FormControl>
                      <Input placeholder="624211" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              disabled={isLoading}
              name="country"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="India" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type="submit" className="flex ml-auto">
              {isLoading && <Loader2 className="animate-spin" />}
              Save Account Information
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SubAccountDetails;
