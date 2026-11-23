import { createMetadata } from "@/lib/seo";
import LoginForm from "./LoginForm";

export const metadata = createMetadata({ title: "Admin sign in", description: "EKE administration access.", path: "/login", noindex: true });

export default function LoginPage() {
  return <LoginForm />;
}
