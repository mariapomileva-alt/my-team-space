import { Suspense } from "react";
import { AdminSignupForm } from "./signup-form";

export default function AdminSignupPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <Suspense
        fallback={
          <p className="text-sm text-zinc-500" role="status">
            Loading…
          </p>
        }
      >
        <AdminSignupForm />
      </Suspense>
    </div>
  );
}
