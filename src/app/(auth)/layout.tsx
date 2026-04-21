import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/api/client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = getAccessToken();
  if (token) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 blur-[100px] rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 blur-[100px] rounded-full" />
      <div className="w-full max-w-md relative">
        {children}
      </div>
    </div>
  );
}