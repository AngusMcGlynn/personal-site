import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-medium text-heading">Admin</h1>
        <LoginForm />
      </div>
    </div>
  );
}
