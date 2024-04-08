import { auth } from "@/auth";
import Sidebar from "./components/Sidebar";
import { redirect } from "next/navigation";
import { Providers } from "../components/providers/Provider";
import { Toaster } from "sonner";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { SocketProvider } from "../components/providers/SocketProvider";
import { MensajesProvider } from "@/context/messages";
import ProviderClient from "../components/providers/QueryClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ticket - Tech Admin",
  description: "Administrator",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }
  return (
    <>
      <div className="flex min-h-screen w-full">
        <Providers>
          <SocketProvider>
            <Sidebar sessionData={session} />
            <main className="flex-1 bg-gray-100 overflow-y-auto h-screen sm:ml-0 p-4 md:p-8">
              <div className="max-w-full mt-16 sm:max-w-md md:max-w-4xl lg:-mt-7 lg:w-full lg:max-w-7xl mx-auto md:mt-10 overflow-y-auto">
                <NextSSRPlugin
                  routerConfig={extractRouterConfig(ourFileRouter)}
                />

                {children}
              </div>
            </main>
          </SocketProvider>
        </Providers>
        <Toaster richColors />
      </div>
    </>
  );
}
