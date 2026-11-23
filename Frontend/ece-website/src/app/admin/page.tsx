import { createMetadata } from "@/lib/seo";
import AdminDashboard from "./AdminDashboard";

export const metadata = createMetadata({ title: "Administration", description: "EKE administration access.", path: "/admin", noindex: true });

export default function AdminPage() {
  return <AdminDashboard />;
}
