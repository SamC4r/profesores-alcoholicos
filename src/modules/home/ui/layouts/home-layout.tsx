'use client'
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Navbar } from "../components/home-navbar/home-navbar";

  
export const HomeLayout = ({ children }: { children: React.ReactNode }) => {


  return (
    <div>
          <Navbar />
          {children}
    </div>
  )
}  