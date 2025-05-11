"use client";

import { useToast } from "@/hooks/use-toast";
import { saveActivityLogsNotification, sentInvitation } from "@/lib/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

type SendInvitationProps = {
  agencyId: string;
};

const SentInvitation: React.FC<SendInvitationProps> = ({ agencyId }) => {
  const { toast } = useToast();
  const userSchema = z.object({
    email: z.string().email(),
    role: z.enum(["AGENCY_OWNER", "AGENCY_ADMIN", "SUBACCOUNT_USER"]),
  });
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      role: "SUBACCOUNT_USER",
    },
  });

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    try {
      const res = await sentInvitation(values.role, values.email, agencyId);
      await saveActivityLogsNotification({
        agencyId: agencyId,
        description: `Sent an invitation to ${values.email}`,
        subaccountId: undefined,
      });
      toast({
        title: "success",
        description: "Invitation sent successfully",
      });
      form.reset();
    } catch (error) {
      console.log("error from submit", error);
      toast({
        title: "Oppse!",
        variant: "destructive",
        description: "Could not send invitation",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Invitation</CardTitle>
        <CardDescription>
          An invitation will be send to the user. Users who already have an
          invitation sent out to their email , will not be able to receive
          another invitation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
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
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <FormControl>
                      <SelectContent>
                        <SelectItem value="AGENCY_ADMIN">
                          Agency Admin
                        </SelectItem>
                        <SelectItem value="SUBACCOUNT_USER">
                          Sub Account User
                        </SelectItem>
                        <SelectItem value="SUBACCOUNT_GUEST">
                          Sub Account Guest
                        </SelectItem>
                      </SelectContent>
                    </FormControl>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full mt-4"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              "Send Invitation"
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SentInvitation;
