"use client";

import type React from "react";

import { useState } from "react";
import { Plus } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import type { TheaterType } from "@/lib/types";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { theaterSchema } from "@/lib/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTheater } from "@/actions/theaters";

interface CreateTheaterModalProps {
  onTheaterCreated: (message: string) => void;
}

export function CreateTheaterModal({
  onTheaterCreated,
}: CreateTheaterModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof theaterSchema>>({
    resolver: zodResolver(theaterSchema),
    defaultValues: {
      theaterNumber: 0,
    },
  });

  async function onSubmit(data: z.infer<typeof theaterSchema>) {
    setIsSubmitting(true);
    try {
      const newTheater = {
        theaterNumber: data.theaterNumber,
      };
      const theater = await createTheater(newTheater.theaterNumber);
      onTheaterCreated("Sala creada exitosamente!");
      toast.success("Theater created successfully!");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create theater. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Theater
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Theater</DialogTitle>
          <DialogDescription>
            Create a new theater for the cinema.
          </DialogDescription>
        </DialogHeader>
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
                {isSubmitting ? "Creating..." : "Create Theater"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
