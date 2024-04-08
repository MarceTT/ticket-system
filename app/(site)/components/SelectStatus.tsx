import { SelectStatusSchema } from "@/schemas/select-status";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { UpdateStatusTicket } from "@/actions/tickets";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SelectStatusProps {
  currentStatus: string;
  idTicket: string;
}

const SelectStatus = ({ currentStatus, idTicket }: SelectStatusProps) => {
  const { data: session } = useSession();
  type SelectStatusForm = z.infer<typeof SelectStatusSchema>;
  const router = useRouter();

  const form = useForm<SelectStatusForm>({
    resolver: zodResolver(SelectStatusSchema),
    defaultValues: {
      status: currentStatus,
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    // Actualizar el valor del estado del formulario cuando cambia la prop currentStatus
    form.setValue("status", currentStatus);
  }, [currentStatus]);

  const status = form.watch("status");

  const userRole = session?.user.role;

  const proccessForm = async (values: z.infer<typeof SelectStatusSchema>) => {
    console.log(values);
    const resp = await UpdateStatusTicket(idTicket, values.status);

    if (resp.success) {
      toast.success("Ticket created successfully", {
        duration: 2000,
        position: "top-center",
      });
      router.push("/tickets");
    } else {
      toast.error("Error creating ticket", {
        duration: 2000,
        position: "top-center",
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(proccessForm)} className="space-y-8">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="OPEN">OPEN</SelectItem>
                    <SelectItem value="CLOSED">CLOSED</SelectItem>
                    <SelectItem value="PROCESS">PROCESS</SelectItem>
                    <SelectItem value="FINISHED">FINISHED</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {(currentStatus !== "FINISHED" || userRole === "ADMIN") && (
            <Button type="submit">Submit</Button>
          )}
        </form>
      </Form>
    </>
  );
};

export default SelectStatus;
