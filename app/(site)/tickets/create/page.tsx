"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TicketSchema } from "@/schemas/ticket";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  GetUsers,
  GetCategories,
  GetPriorities,
  GetProjects,
} from "@/actions/selects";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton, UploadDropzone } from "@/lib/utils";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { CreateTicketData } from "@/actions/tickets";
import { useSession } from "next-auth/react";

const CreateTickets = () => {
  const [options, setOptions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  const { data: session } = useSession();

  useEffect(() => {
    // Obtener datos desde el Server Action
    const fetchData = async () => {
      const response = await GetUsers();
      setOptions(response);
    };

    const fetchCategories = async () => {
      const category = await GetCategories();
      setCategories(category);
    };

    const fetchPriorities = async () => {
      const priority = await GetPriorities();
      setPriorities(priority);
    };

    const fetchProjects = async () => {
      const projects = await GetProjects();
      setProjects(projects);
    };

    fetchData();
    fetchCategories();
    fetchPriorities();
    fetchProjects();
  }, []);

  type TicketForm = z.infer<typeof TicketSchema>;

  const form = useForm<TicketForm>({
    resolver: zodResolver(TicketSchema),
    defaultValues: {
      title: "",
      assignedTo: "",
      project: "",
      description: "",
      category: "",
      priority: "",
      image: undefined,
    },
  });
  const isLoading = form.formState.isSubmitting;

  const image = form.watch("image");

  const proccessForm = async (values: z.infer<typeof TicketSchema>) => {
    console.log(values);

    const data = {
      title : values.title,
      assignedTo : values.assignedTo,
      project : values.project,
      description : values.description,
      category : values.category,
      priority : values.priority,
      createdBy: session?.user.id,
      image : values.image,
    };

    const resp = await CreateTicketData(data);
    if(resp.success){
      form.reset();
      toast.success("Ticket created successfully", {
        duration: 2000,
        position: "top-center",
      });
    }else{
      toast.error("Error creating ticket", {
        duration: 2000,
        position: "top-center",
      });
    }
  };
  return (
    <div className="flex space-y-4 p-4 items-center justify-center mt-6">
      <Card className="w-full items-center justify-center">
        <CardHeader>
          <CardTitle>Create ticket</CardTitle>
          <CardDescription>
            Enter the details below to create a new ticket.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-2xl space-y-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(proccessForm)}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your title"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="assignedTo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assigned To</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
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
                                      <img src={option.image} alt={option.name} className="w-5 h-5 mr-2 rounded-full" />
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
                    </div>
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="project"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a project" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {projects.map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                  {project.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us a little bit about yourself"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
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
                    </div>
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
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
                    </div>
                  </div>
                  <div className="space-y-2">
                    {!!image ? (
                      <div className="h-96 md:h-[450px] overflow-hidden rounded-md">
                        <AspectRatio ratio={1 / 1} className="relative h-full">
                          <Image
                            src={image}
                            alt="Post preview"
                            fill
                            className="rounded-md object-cover"
                          />
                        </AspectRatio>
                      </div>
                    ) : (
                      <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                              <UploadDropzone
                                endpoint="imageUploader"
                                onClientUploadComplete={(res) => {
                                  form.setValue("image", res[0].url);
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

                              {/* <Input
                                  placeholder="shadcn"
                                  {...fileRef}
                                  type="file"
                                  onChange={handleImageChange}
                              /> */}

                              {/* <SingleImageDropzone
                                      width={680}
                                      height={300}
                                      value={file}
                                      dropzoneOptions={{
                                          maxSize: 1024 * 1024 * 5,
                                        }}
                                        onChange={(file) => {
                                          setFile(file);
                                        }}
                                    /> */}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  {/* {progress > 0 && <ProgressBar value={progress} />} */}

                  {/* {isLoading ? (
                  <Button disabled={isLoading}>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button  type="submit" size="sm">Create ticket</Button>
                )} */}
                  <Button type="submit" size="sm" variant={"primary"} disabled={isLoading}>
                    Create ticket
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default CreateTickets;
