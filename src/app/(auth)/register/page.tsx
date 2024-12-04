"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, UserIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PatientRegisterSchema } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { z } from "zod";
import Link from "next/link";

function PatientRegisterForm() {
  const form = useForm({
    resolver: zodResolver(PatientRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      DOB: new Date(),
      role: "patient", // Default role to 'patient'
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Function to check if the email belongs to a pharmacist
  const getRoleFromEmail = (email: string) => {
    return email.endsWith("@pharmacy") ? "pharmacist" : "patient";
  };

  async function onSubmit(values: z.infer<typeof PatientRegisterSchema>) {
    setIsLoading(true);
    setError("");
    setSuccess("");


    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registration failed");
      }

      const data = await response.json();
      setSuccess("Registration successful!");
      console.log("User created:", data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
              <FormDescription>
                Must be at least 8 characters long and contain uppercase,
                lowercase, number, and special character.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="DOB"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <UserIcon className="mr-2 h-4 w-4 animate-spin" />}
          Register
        </Button>
      </form>
      <Link
        href="/login"
        className="text-blue-500 hover:underline text-xs my-2"
      >
        Already have an account? Login here.
      </Link>
    </Form>
  );
}

export default PatientRegisterForm;
