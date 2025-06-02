"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/schemas";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { login, user } = useAuth();

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      await login(data.username, data.password);
      router.push("/callback")
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(
          "Ocurrió un error inesperado al iniciar sesión. Por favor, inténtalo más tarde."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">¡Hola de nuevo!</h1>
            <p className="text-muted-foreground text-sm">
              Inicia sesión para continuar con tu cuenta.
            </p>
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Nombre de usuario</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Introduce tu nombre de usuario..."
                      className="h-8"
                      {...field}
                    />
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
                  <FormLabel className="text-sm">Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Introduce tu contraseña..."
                      type="password"
                      className="h-8"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full"
              size="sm"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
            <div className="text-center text-sm">
              ¿Aun no tienes cuenta?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Regístrate
              </Link>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
