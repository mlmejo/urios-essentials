import { ReactNode } from "react";
import Sidebar from "./sidebar";

export default function AdminLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <Sidebar />

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
