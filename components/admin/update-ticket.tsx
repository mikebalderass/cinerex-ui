"use client";

import React, { useState, useEffect } from "react";
import { Plus, Minus, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";

import type {
  FunctionType,
  MovieType,
  TheaterType,
  TicketType,
} from "@/lib/types";
import { toast } from "sonner";
import { useTicket } from "@/hooks/use-tickets";
import { updateTicket } from "@/actions/tickets";

const formSchema = z.object({
  functionId: z.string().min(1, "Showtime is required"),
  userName: z.string().min(1, "Name is required"),
  userEmail: z.string().email().optional(),
});

interface SeatSelection {
  row_letter: string;
  seat_number: number;
}

interface EditTicketModalProps {
  ticketId: string;
  functions: FunctionType[];
  movies: MovieType[];
  theaters: TheaterType[];
  onUpdated: (updatedTicket: string) => void;
}

export function UpdateTicketModal({
  ticketId,
  functions,
  movies,
  theaters,
  onUpdated,
}: EditTicketModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<SeatSelection[]>([]);
  const [newSeat, setNewSeat] = useState({ row: "", number: "" });

  const { ticketData: ticket, loading } = useTicket(ticketId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      functionId: "",
      userName: "",
      userEmail: "",
    },
  });

  useEffect(() => {
    if (ticket) {
      form.reset({
        functionId: ticket.functionId,
        userName: ticket.userName,
      });
      setSelectedSeats(ticket.seats);
    }
  }, [ticket]);

  const getShowtimeDisplay = (func: FunctionType) => {
    const movie = movies.find((m) => m.movieId === func.movieId);
    const theater = theaters.find((t) => t.theaterId === func.theaterId);
    return `${movie?.title} - ${
      theater?.theaterNumber
    } - ${func.datetime.toLocaleString()}`;
  };

  const addSeat = () => {
    const seatNumber = parseInt(newSeat.number);
    if (!newSeat.row || isNaN(seatNumber) || seatNumber <= 0) {
      toast.error("Invalid seat", {
        description: "Enter valid row and positive seat number",
      });
      return;
    }

    const exists = selectedSeats.some(
      (seat) =>
        seat.row_letter === newSeat.row.toUpperCase() &&
        seat.seat_number === seatNumber
    );
    if (exists) {
      toast.error("Seat already added");
      return;
    }

    setSelectedSeats((prev) => [
      ...prev,
      { row_letter: newSeat.row.toUpperCase(), seat_number: seatNumber },
    ]);
    setNewSeat({ row: "", number: "" });
  };

  const removeSeat = (index: number) => {
    setSelectedSeats((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (selectedSeats.length === 0) {
      toast.error("At least one seat must be selected");
      return;
    }

    const updatedTicket = {
      ...ticket!,
      ...values,
      seats: selectedSeats,
    };

    try {
      // Simulate update API
      await updateTicket(
        ticketId,
        values.functionId,
        new Date(ticket!.purchaseDate).toISOString(),
        values.userName,
        selectedSeats
      );
      onUpdated("Boleto actualizado correctamente");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to update ticket");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Ticket</DialogTitle>
          <DialogDescription>Update the ticket details.</DialogDescription>
        </DialogHeader>

        {loading || !ticket ? (
          <div className="p-4 text-center text-muted-foreground">
            Loading...
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="functionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Showtime</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select showtime" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {functions.map((func) => (
                          <SelectItem
                            key={func.functionId}
                            value={func.functionId}
                          >
                            {getShowtimeDisplay(func)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Seat Selection */}
              <div className="space-y-2">
                <Label>Seats</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Row (A-H)"
                    value={newSeat.row}
                    onChange={(e) =>
                      setNewSeat((prev) => ({ ...prev, row: e.target.value }))
                    }
                    className="w-24"
                    maxLength={1}
                  />
                  <Input
                    placeholder="Seat #"
                    type="number"
                    value={newSeat.number}
                    onChange={(e) =>
                      setNewSeat((prev) => ({
                        ...prev,
                        number: e.target.value,
                      }))
                    }
                    className="w-24"
                    min="1"
                    max="12"
                  />
                  <Button type="button" onClick={addSeat} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {selectedSeats.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {selectedSeats.map((seat, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {seat.row_letter}
                        {seat.seat_number}
                        <button
                          type="button"
                          onClick={() => removeSeat(index)}
                          className="ml-1 hover:text-destructive"
                          title="Eliminar asiento"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Ticket</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
