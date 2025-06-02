"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Callback() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role.includes("Customer")) {
        router.push("/");
      } else if (user.role.includes("Admin")) {
        router.push("/admin");
      }
    }
  }, [user, isLoading, router]);
}
