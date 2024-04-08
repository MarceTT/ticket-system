"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

const ErrorScreen = ({ error }: { error: Error & { digest?: string } }) => {
    const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-red-500">Error</h1>
        <p className="text-lg text-gray-600">
          An error occurred while processing your request
        </p>
        <p className="text-lg text-gray-600">Error: {error.message}</p>
        {error.digest && (
          <p className="text-lg text-gray-600">Error digest: {error.digest}</p>
        )}
        <Button
          onClick={() => router.back()}
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
            Go back
        </Button>
      </div>
    </div>
  );
};

export default ErrorScreen;
