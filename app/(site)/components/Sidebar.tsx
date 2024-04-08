"use client";
import { signOut } from "next-auth/react";
import { LogOut, LucideHelpCircle, Package2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import MobileMenu from "./MobileMenu";
import { logout } from "@/actions/logout";
import ProfileImage from "./ProfileImage";
import AdminMenu from "./user/AdminMenu";
import UserMenu from "./user/UserMenu";

interface SidebarProps {
  sessionData: any;
}

const Sidebar = ({ sessionData }: SidebarProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/50 lg:hidden xl:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
      <MobileMenu
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-10 flex flex-col w-60 border-r bg-gradient-to-r from-[#0A0F55] to-[#0C105A] dark:bg-gray-800/40 top-0  transition-all duration-300 transform lg:translate-x-0 lg:static lg:inset-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {" "}
          {/* Added h-full to fill the height */}
          <div className="mt-14 lg:mt-10 md:mt-10">

            <div className="hidden md:flex h-[60px] items-center px-6 text-white">
              <Link className="flex items-center gap-2 font-semibold" href="#">
                <Package2Icon className="h-6 w-6" />
                <span className="text-2xl">Acme Inc</span>
              </Link>
            </div>
            

            {/* Main navigation */}
            {sessionData?.user.role === "ADMIN" ? (
              <AdminMenu
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              />
            ) : (
              <UserMenu />
            )}
          </div>
          {/* Fixed section at the bottom for user account and logout */}
          <div className="mt-auto text-white">
            {" "}
            {/* This ensures that this div sticks to the bottom */}
            {/* Secondary navigation */}
            <div className="space-y-2 py-4 px-2">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-[#2B3064]"
              >
                <LucideHelpCircle className="h-4 w-4" />
                Help
              </Link>
              <Link
                href="#"
                onClick={() => logout()}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-[#2B3064]"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Link>
            </div>
            {/* User account section */}
            <div className="flex items-center px-4 pb-10">
              {" "}
              {/* Added padding-bottom */}
              <ProfileImage imageProfile={sessionData?.user.image} />
              <div className="ml-4">
                <Link
                  className="font-light cursor-pointer hover:bg-[#2B3064] hover:rounded-lg hover:px-3 hover:py-2 hover:transition-all hover:duration-200"
                  href={`/profile`}
                >
                  {sessionData?.user.name}
                </Link>
                {/* <p className="font-light cursor-pointer">ADMIN</p> */}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
