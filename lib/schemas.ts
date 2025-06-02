import { z } from "zod";

// name, username, email, password, confirmPassword
export const signupSchema = z
  .object({
    name: z.string().min(1, "El nombre es requerido"),
    username: z.string().min(1, "El nombre de usuario es requerido"),
    email: z.string().email("Debe ser un correo electrónico válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

// username, password
export const loginSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es requerido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const movieSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  duration: z.coerce.number().min(1, "La duración debe ser al menos 1 minuto"),
  rating: z.coerce
    .number()
    .min(0, "El rating debe ser mayor que 0")
    .max(10, "El rating debe ser menor o igual a 10"),
  poster: z.string().url("La URL del póster debe ser válida"),
});

export const showtimeSchema = z.object({
  movieId: z.string().min(1, "El ID de la película es requerido"),
  theaterId: z.string().min(1, "El ID del teatro es requerido"),
  dateTime: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
    message: "La fecha y hora deben ser válidas",
  }),
});

export const theaterSchema = z.object({
  theaterNumber: z.coerce.number().min(1, "El número del teatro es requerido"),
});
