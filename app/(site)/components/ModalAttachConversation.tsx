"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { UploadButton, UploadDropzone } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AttachmentSchema } from "@/schemas/attachment";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CloudUpload, Send } from "lucide-react";

type AttachmentForm = z.infer<typeof AttachmentSchema>;

interface AttachmentModaleProps {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  onMessageSend: (message: string) => void;
}

const ModalAttachConversation = ({
  isOpen,
  onClose,
  onMessageSend
}: AttachmentModaleProps) => {

const [uploadMessage, setUploadMessage] = React.useState<string[]>([]);


  const form = useForm<AttachmentForm>({
    resolver: zodResolver(AttachmentSchema),
    defaultValues: {
      file: null,
    },
  });

  const handleClose = () => {
    form.reset();
    onClose(false);
    
  }

  const file = form.watch("file");

  const isLoading = form.formState.isSubmitting;

  const proccessForm = async (values: z.infer<typeof AttachmentSchema>) => {
    console.log(values);
    onMessageSend(values.file);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add an attachment</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(proccessForm)}>
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Send a file as a message</FormLabel>
                        <FormControl>
                          <UploadDropzone
                            endpoint="ticketAttachement"
                            onClientUploadComplete={(res) => {
                              form.setValue("file", res[0].url);
                              setUploadMessage(res.map((r) => r.url));
                              toast.success("Image uploaded successfully", {
                                duration: 2000,
                                position: "top-center",
                              });
                            }}
                            onUploadError={(err: Error) => {
                              console.error(err);
                              toast.error("Image upload failed", {
                                duration: 2000,
                                position: "top-center",
                              });
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <DialogFooter className="mt-3">
                  {uploadMessage.length > 0 && (
                  <Button
                    type="submit"
                    size="sm"
                    variant={"primary"}
                    disabled={isLoading}
                  >
                    <CloudUpload className="h-4 w-4 mr-2 -translate-y-0.5 inline-block" />
                    Send
                  </Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAttachConversation;
