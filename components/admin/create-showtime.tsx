"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FunctionType, MovieType, TheaterType, SeatType } from "@/lib/types"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { showtimeSchema } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { createShowtime } from "@/actions/showtimes"
import { Form } from "../ui/form"

interface CreateShowtimeModalProps {
  movies: MovieType[]
  theaters: TheaterType[]
  onShowtimeCreated: (showtime: string) => void
}

export function CreateShowtimeModal({ movies, theaters, onShowtimeCreated }: CreateShowtimeModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof showtimeSchema>>({
    resolver: zodResolver(showtimeSchema),
    defaultValues: {
      movieId: "",
      theaterId: "",
      dateTime: new Date(),
    },
  })

  async function onSubmit(data: z.infer<typeof showtimeSchema>) {
    setIsSubmitting(true)
    try {
      const showtime = await createShowtime(data.movieId, data.theaterId, data.dateTime)
      onShowtimeCreated("Función creada correctamente")
      toast.success("Showtime created successfully!")
      setOpen(false)
    } catch (error) {
      toast.error("Failed to create showtime. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Showtime
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Showtime</DialogTitle>
          <DialogDescription>Schedule a new movie showtime for a theater.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="movieId">Movie</Label>
              <Select
                {...form.register("movieId")}
                defaultValue=""
                onValueChange={(value) => form.setValue("movieId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a movie" />
                </SelectTrigger>
                <SelectContent>
                  {movies.map((movie) => (
                    <SelectItem key={movie.movieId} value={movie.movieId}>
                      {movie.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="theaterId">Theater</Label>
              <Select
                {...form.register("theaterId")}
                defaultValue=""
                onValueChange={(value) => form.setValue("theaterId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a theater" />
                </SelectTrigger>
                <SelectContent>
                  {theaters.map((theater) => (
                    <SelectItem key={theater.theaterId} value={theater.theaterId}>
                      Theater {theater.theaterNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateTime">Date and Time</Label>
              <Input
                type="datetime-local"
                id="dateTime"
                {...form.register("dateTime")}
                min={today}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Creating..." : "Create Showtime"}
              </Button>
            </DialogFooter>
          </form>
          {form.formState.errors && (
            <p className="text-primary text-sm mt-2">
              {Object.values(form.formState.errors).map((error) => error.message).join(", ")}
            </p>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  )
}
