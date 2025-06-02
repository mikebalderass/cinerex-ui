"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupSchema } from "@/lib/schemas";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function SignupPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { signup, user } = useAuth();

  async function onSubmit(data: z.infer<typeof signupSchema>) {
    try {
      await signup(data.name, data.email, data.username, data.password);
      router.push("/callback");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(
          "Ocurrió un error inesperado. Por favor, inténtalo más tarde."
        );
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">¡Hola!</h1>
            <p className="text-muted-foreground text-sm">
              Crea una cuenta para comenzar a disfrutar de nuestros servicios.
            </p>
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="gap-1">
                  <FormLabel className="text-sm mb-0">Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Introduce tu nombre..."
                      size={20}
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
              name="email"
              render={({ field }) => (
                <FormItem className="gap-1">
                  <FormLabel className="text-sm">Correo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Introduce tu correo electrónico..."
                      type="email"
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
              name="username"
              render={({ field }) => (
                <FormItem className="gap-1">
                  <FormLabel className="text-sm">Nombre de usuario</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Introduce un nombre de usuario..."
                      className="h-8"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground">
                    Este será tu identificador único en la plataforma.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="gap-1">
                  <FormLabel className="text-sm">Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Introduce una contraseña..."
                      type="password"
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="gap-1">
                  <FormLabel className="text-sm">
                    Confirmar contraseña
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirma tu contraseña..."
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
            <Button type="submit" className="w-full" size="sm">
              Registrarse
            </Button>
            <div className="text-center text-sm">
              Ya tienes una cuenta?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Inicia sesión
              </Link>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
