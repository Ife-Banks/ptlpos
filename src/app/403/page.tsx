"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldOff } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="text-center max-w-full">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-error-bg">
          <ShieldOff className="h-10 w-10 text-error" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Access Denied</h1>
        <p className="text-text-secondary mb-6">
          You don&apos;t have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="secondary" onClick={() => window.history.back()}>
            Go Back
          </Button>
          <Link href="/">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}