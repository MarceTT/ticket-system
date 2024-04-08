"use server";

import { databse } from "@/lib/prismadb";

export const GetCategories = async () => {
  const categories = await databse.category.findMany();
  return categories;
};

export const GetUsers = async () => {
  const users = await databse.user.findMany({
    where: {
        role: "USER",
        },
  });
  return users;
};

export const GetPriorities = async () => {
  const priorities = await databse.priority.findMany();
  return priorities;
}

export const GetProjects = async () => {
  const projects = await databse.project.findMany();
  return projects;
}
