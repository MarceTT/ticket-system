"use client";

import { GetCategories, GetPriorities } from "@/actions/selects";
import { UpdateTicketModal } from "@/actions/tickets";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectEditTicketSchema } from "@/schemas/select-edit-ticket";
import { TicketList } from "@/types/ticket";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

interface ModalEditAssignedProps {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  ticket: TicketList | null;
}

const ModalEditTicket = ({
  isOpen,
  onClose,
  ticket,
}: ModalEditAssignedProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);

  const form = useForm({
    resolver: zodResolver(SelectEditTicketSchema),
    defaultValues: {
      category: ticket?.category.id || "",
      priority: ticket?.priority.id || "",
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const category = await GetCategories();
      setCategories(category);
    };

    const fetchPriorities = async () => {
      const priority = await GetPriorities();
      setPriorities(priority);
    };

    fetchCategories();
    fetchPriorities();

    if (ticket) {
      form.reset({
        category: ticket.category.id,
        priority: ticket.priority.id,
      });
    }
  }, [ticket, form.reset]);

  const proccessForm = async (
    values: z.infer<typeof SelectEditTicketSchema>
  ) => {
    try {
      const validate = SelectEditTicketSchema.safeParse(values);
      const { category, priority } = values;

      const data = {
        category,
        priority,
        id: ticket?.id,
      };

      const resp = await UpdateTicketModal(data);
      if (resp.success) {
        toast.success(resp.message, { duration: 2000, position: "top-center" });
        onClose(false);
      } else {
        toast.error(resp.message, { duration: 2000, position: "top-center" });
      }
    } catch (error) {
      toast.error(error as any, { duration: 2000, position: "top-center" });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Ticket</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(proccessForm)}>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={ticket?.category.id}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={ticket?.priority.id}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {priorities.map((prio) => (
                        <SelectItem key={prio.id} value={prio.id}>
                          {prio.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end mt-4">
              <Button type="submit" variant={"primary"}>
                Edit Ticket
              </Button>
            </div>
          </form>
        </Form>
        {/* <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default ModalEditTicket;
