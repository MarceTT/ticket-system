"use client";
import { MenuIcon, XIcon } from 'lucide-react';
import React from 'react'

type MobileMenuProps = {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileMenu = ({isMobileMenuOpen,setIsMobileMenuOpen}: MobileMenuProps) => {
  return (
    <div className="lg:hidden flex justify-between items-center p-4 shadow-md fixed top-0 right-0 left-0 z-20 bg-gradient-to-r from-[#0A0F55] to-[#0C105A]">
    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
      {isMobileMenuOpen ? (
        <XIcon className="w-6 h-6 text-white cursor-pointer" />
      ) : (
        <MenuIcon className="w-6 h-6 text-white cursor-pointer" />
      )}
    </button>
    <div className="flex items-center justify-center h-3 gap-x-4 shadow-sm px-4 lg:px-8 sm:gap-x-6 sm:px-6">
      <span className="text-xl text-white font-semibold">Acme Inc</span>
    </div>
  </div>
  )
}

export default MobileMenu