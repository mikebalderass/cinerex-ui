"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Edit, Pencil } from "lucide-react"

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
import type { FunctionType, MovieType, TheaterType } from "@/lib/types"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { showtimeSchema } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateShowtime } from "@/actions/showtimes"
import { Form } from "../ui/form"
import { useFunction } from "@/hooks/use-functions" // Asumiendo que este es tu hook

interface EditShowtimeModalProps {
  showtimeId: string
  movies: MovieType[]
  theaters: TheaterType[]
  onShowtimeUpdated: (message: string) => void
}

export function UpdateShowtimeModal({ showtimeId, movies, theaters, onShowtimeUpdated }: EditShowtimeModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { functionData: showtime, loading, error } = useFunction(showtimeId)

  const form = useForm<z.infer<typeof showtimeSchema>>({
    resolver: zodResolver(showtimeSchema),
    defaultValues: {
      movieId: "",
      theaterId: "",
      dateTime: new Date(),
    },
  })

  useEffect(() => {
    if (showtime) {
      form.reset({
        movieId: showtime.movieId,
        theaterId: showtime.theaterId,
        dateTime: new Date(showtime.datetime),
      })
    }
  }, [showtime, form])

  async function onSubmit(data: z.infer<typeof showtimeSchema>) {
    setIsSubmitting(true)
    try {
      const updated = await updateShowtime(showtimeId, data.movieId, data.theaterId, data.dateTime)
      onShowtimeUpdated("Función actualizada correctamente")
      toast.success("Showtime updated successfully!")
      setOpen(false)
    } catch (error) {
      toast.error("Failed to update showtime. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Showtime</DialogTitle>
          <DialogDescription>Update the showtime details.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Failed to load showtime data.</p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="movieId">Movie</Label>
                <Select
                  value={form.watch("movieId")}
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
                  value={form.watch("theaterId")}
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
                  value={new Date(form.watch("dateTime")).toISOString().slice(0, 16)}
                  onChange={(e) => form.setValue("dateTime", new Date(e.target.value))}
                  min={today}
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
