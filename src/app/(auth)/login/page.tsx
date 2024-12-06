"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/lib/validations";
import { z } from "zod";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

function PatientLoginForm() {
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "patient", // default role is patient
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function generateInitialPrescription(id: string) {
    try {
      const prescriptionResponse = await fetch("/api/prescriptions/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!prescriptionResponse.ok) {
        console.warn("Failed to generate initial prescription");
      }
    } catch (error) {
      console.error("Error generating initial prescription:", error);
    }
  }

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    setIsLoading(true);
    setErrorMessage("");

    // Check if email ends with "@pharmacy" and update role to "pharmacist"
    if (values.email.endsWith("@pharmacy.com")) {
      values.role = "pharmacist";
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Something went wrong");
        return;
      }

      const data = await response.json();

      console.log("Login successful:", data);
      localStorage.setItem("token", data.token);

      if (values.email.endsWith("@pharmacy.com")) {
        window.location.href = "/dashboard/pharmacist";
      } else {
        // For patients, generate initial prescription
        await generateInitialPrescription(data.user.id);
        window.location.href = "/dashboard/patient";
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>
        <Link
          href="/register"
          className=" text-blue-500 hover:underline text-xs my-2"
        >
          Don&apos;t have an account? Register here.
        </Link>
      </form>
    </Form>
  );
}
export default PatientLoginForm;
