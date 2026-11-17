import type { Metadata } from "next";
import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = { title: "EKE — Administration" };

export default function AdminPage() {
  return <AdminDashboard />;
}
