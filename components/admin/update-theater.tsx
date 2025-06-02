"use client";

import { useEffect, useState } from "react";
import { Edit, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { theaterSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updateTheater } from "@/actions/theaters"; // Asegúrate de tener esta acción
import type { TheaterType } from "@/lib/types";
import { useTheater } from "@/hooks/use-theaters"; // Suponiendo que aquí está tu hook

interface EditTheaterModalProps {
  theaterId: string;
  onTheaterUpdated: (message: string) => void;
}

export function UpdateTheaterModal({
  theaterId,
  onTheaterUpdated,
}: EditTheaterModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { theaterData, loading } = useTheater(theaterId);

  const form = useForm<z.infer<typeof theaterSchema>>({
    resolver: zodResolver(theaterSchema),
    defaultValues: {
      theaterNumber: 0,
    },
  });

  useEffect(() => {
    if (theaterData) {
      form.reset({
        theaterNumber: Number(theaterData.theaterNumber),
      });
    }
  }, [theaterData, form]);

  async function onSubmit(data: z.infer<typeof theaterSchema>) {
    setIsSubmitting(true);
    try {
      const updated = await updateTheater(theaterId, data.theaterNumber);
      onTheaterUpdated("Sala actualizada correctamente");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update theater. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Theater</DialogTitle>
          <DialogDescription>Update the theater number.</DialogDescription>
        </DialogHeader>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="theaterNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Theater Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter theater number"
                          {...field}
                          type="number"
                          min={1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
