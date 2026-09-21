"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRegisterSchema, UserRegisterType } from "@/schema/v1/user/user.schema";
import axios from "axios";
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterType>({
    resolver: zodResolver(UserRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Using useWatch avoids the React Compiler memoization warning
  const passwordValue = useWatch({ control, name: "password" }) || "";

  const onSubmit = async (data: UserRegisterType) => {
    setServerError(null);
    try {
      const res = await axios.post("/api/v1/user", data);
      if (!res) {
        throw new Error("Registration failed");
      }
      router.push("/sign-in");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const serverMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          (typeof err.response?.data === "string" ? err.response.data : null);
        setServerError(serverMessage || err.message || "Something went wrong.");
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Something went wrong.");
      }
    }
  };

  return (
    <div className="relative w-full max-w-md rounded-3xl border-2 border-slate-900 bg-slate-950 p-8 shadow-2xl shadow-slate-950 sm:p-10 my-6">
      {/* Ambient Glows */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 h-48 w-48 rounded-full bg-teal-500/15 blur-3xl" />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-medium text-cyan-300">
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
          <span>Planora Workspace</span>
        </div>

        <h1 className="pt-2 text-2xl font-bold font-playfair text-white sm:text-3xl">
          Create an account
        </h1>
        <p className="text-xs text-slate-400">
          Enter your details below to begin planning blueprints
        </p>
      </div>

      {serverError && (
        <div className="mt-5 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
          {serverError}
        </div>
      )}

      {/* Credentials Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-medium text-slate-300">Full Name</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              {...register("name")}
              type="text"
              placeholder="e.g. Alex Morgan"
              className="w-full rounded-xl border border-slate-800 bg-slate-900/80 focus:bg-slate-900/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition focus:border-cyan-500 focus:outline-none"
            />
          </div>
          {errors.name && <p className="text-[11px] text-rose-400">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-medium text-slate-300">Email Address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              {...register("email")}
              type="email"
              placeholder="name@example.com"
              className="w-full rounded-xl border border-slate-800 bg-slate-900/80 focus:bg-slate-900/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition focus:border-cyan-500 focus:outline-none"
            />
          </div>
          {errors.email && <p className="text-[11px] text-rose-400">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-medium text-slate-300">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 transition focus:border-cyan-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-rose-400">{errors.password.message}</p>
          )}

          {passwordValue.length > 0 && (
            <div className="flex items-center space-x-1.5 pt-1 text-[11px]">
              <CheckCircle2
                className={`h-3 w-3 ${
                  passwordValue.length >= 8 && passwordValue.length <= 32
                    ? "text-emerald-400"
                    : "text-slate-600"
                }`}
              />
              <span
                className={
                  passwordValue.length >= 8 && passwordValue.length <= 32
                    ? "text-emerald-400 font-mono"
                    : "text-slate-500 font-mono"
                }
              >
                8 to 32 characters ({passwordValue.length}/32)
              </span>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-3 inline-flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:scale-[1.01] hover:from-cyan-400 hover:to-teal-500 active:scale-[0.99] disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Sign Up with Email</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="text-xs text-slate-400 text-center">
          Already have an account?&nbsp;
          <Link href="/sign-in">
            <span className="text-white hover:underline">Sign in</span>
          </Link>
        </p>
      </form>
    </div>
  );
}
