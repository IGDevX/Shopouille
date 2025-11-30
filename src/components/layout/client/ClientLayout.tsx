import { PropsWithChildren } from "react";
import { ClientNavbar } from "./ClientNavbar";

export function ClientLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background">
      <ClientNavbar />
      <main className="w-full">{children}</main>
    </div>
  );
}
