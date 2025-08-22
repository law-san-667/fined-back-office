"use client";

import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import OtpForm from "@/components/otp-form";
import React from "react";

export default function LoginPage() {
  const [step, setStep] = React.useState<"login" | "otp">("login");
  const [email, setEmail] = React.useState("");

  return (
    <div className="bg-accent/10 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Fined.
        </a>

        {step === "login" && (
          <LoginForm setStep={setStep} setEmail={setEmail} />
        )}

        {step === "otp" && <OtpForm email={email} />}
      </div>
    </div>
  );
}
