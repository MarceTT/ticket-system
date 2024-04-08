"use client";

import { GetUsers } from "@/actions/selects";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectEditAssignedSchema } from "@/schemas/select-assigned";
import { TicketList } from "@/types/ticket";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { updateAssignedTicket } from "@/actions/tickets";
import { Loader2 } from "lucide-react";

interface ModalEditAssignedProps {
  isOpen: boolean;
  onCloseAssigned: React.Dispatch<React.SetStateAction<boolean>>;
  ticket: TicketList | null;
}

const ModalEditAssigned = ({
  isOpen,
  onCloseAssigned,
  ticket,
}: ModalEditAssignedProps) => {
  const [options, setOptions] = useState<any[]>([]);

  const form = useForm({
    resolver: zodResolver(SelectEditAssignedSchema),
    defaultValues: {
      assignedTo: ticket?.assigened.id || "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetUsers();
      setOptions(response);
    };
    fetchData();

    if (ticket) {
      form.reset({
        assignedTo: ticket.assigened.id,
      });
    }
  }, [ticket, form.reset]);

  const proccessForm = async (
    values: z.infer<typeof SelectEditAssignedSchema>
  ) => {
    try {
      const validate = SelectEditAssignedSchema.safeParse(values);
      const { assignedTo } = values;
      const data = {
        assignedTo,
        id: ticket?.id,
      };

      const res = await updateAssignedTicket(assignedTo, ticket?.id as string);
      if (res?.success) {
        toast.success("Ticket assigned successfully", {
          duration: 2000,
          position: "top-center",
        });
        onCloseAssigned(false);
      }

      console.log(data);
    } catch (error) {
      toast.error("Error assigned ticket", {
        duration: 2000,
        position: "top-center",
      });
      onCloseAssigned(false);
      console.log(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAssigned}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mt-0">Edit Assigned</DialogTitle>
        </DialogHeader>
        <div className="mb-2 flex flex-col border-b sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-4">
            <img
              className="h-14 w-14 rounded-full object-cover"
              src={ticket?.assigened.image || "/images/avatars/avatar.png"}
              alt="user assigned to ticket"
            />
            <div className="ml-4 w-56">
              <p className="text-slate-800 text-xl font-extrabold">
                {ticket?.assigened.name}
              </p>
              <p className="text-slate-500 text-xs">
                {ticket?.assigened.email} | {ticket?.assigened.role}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                Assigned
              </span>
            </div>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(proccessForm)}>
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned To</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={ticket?.assigened.id}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a assigned" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          <div className="flex items-center">
                            <img
                              src={option.image}
                              alt={option.name}
                              className="w-5 h-5 mr-2 rounded-full"
                            />
                            {option.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end mt-4">
              {isLoading ? (
                <Button disabled={isLoading} variant={"primary"}>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit" variant={"primary"}>
                  Edit Assigned
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEditAssigned;
