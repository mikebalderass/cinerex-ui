"use client";

import type React from "react";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type {
  TicketType,
  FunctionType,
  MovieType,
  TheaterType,
} from "@/lib/types";
import { toast } from "sonner";

interface CreateTicketModalProps {
  functions: FunctionType[];
  movies: MovieType[];
  theaters: TheaterType[];
  onTicketCreated: (ticket: string) => void;
}

interface SeatSelection {
  row_letter: string;
  seat_number: number;
}

export function CreateTicketModal({
  functions,
  movies,
  theaters,
  onTicketCreated,
}: CreateTicketModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    functionId: "",
    userName: "",
    userEmail: "",
  });

  const [selectedSeats, setSelectedSeats] = useState<SeatSelection[]>([]);
  const [newSeat, setNewSeat] = useState({ row: "", number: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form
      if (
        !formData.functionId ||
        !formData.userName ||
        selectedSeats.length === 0
      ) {
        throw new Error(
          "Please fill in all required fields and select at least one seat"
        );
      }

      // Validate seats
      for (const seat of selectedSeats) {
        if (!seat.row_letter || seat.seat_number <= 0) {
          throw new Error("Invalid seat selection");
        }
      }

      // Create new ticket
      const newTicket: TicketType = {
        ticketId: `ticket-${Date.now()}`,
        functionId: formData.functionId,
        userName: formData.userName,
        purchaseDate: new Date(),
        seats: selectedSeats,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onTicketCreated("Boleto creado correctamente");

      const selectedFunction = functions.find(
        (f) => f.functionId === formData.functionId
      );
      const movie = movies.find((m) => m.movieId === selectedFunction?.movieId);

      toast.success("Ticket created", {
        description: `Ticket for ${movie?.title} created for ${formData.userName}.`,
      });

      // Reset form and close modal
      setFormData({
        functionId: "",
        userName: "",
        userEmail: "",
      });
      setSelectedSeats([]);
      setNewSeat({ row: "", number: "" });
      setOpen(false);
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to create ticket",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSeat = () => {
    if (!newSeat.row || !newSeat.number) {
      toast.error("Invalid seat", {
        description: "Please enter both row letter and seat number",
      });
      return;
    }

    const seatNumber = Number.parseInt(newSeat.number);
    if (isNaN(seatNumber) || seatNumber <= 0) {
      toast.error("Invalid seat number", {
        description: "Seat number must be a positive number",
      });
      return;
    }

    // Check if seat already exists
    const exists = selectedSeats.some(
      (seat) =>
        seat.row_letter === newSeat.row.toUpperCase() &&
        seat.seat_number === seatNumber
    );

    if (exists) {
      toast.error("Seat already selected", {
        description: "This seat is already in your selection",
      });
      return;
    }

    setSelectedSeats((prev) => [
      ...prev,
      {
        row_letter: newSeat.row.toUpperCase(),
        seat_number: seatNumber,
      },
    ]);

    setNewSeat({ row: "", number: "" });
  };

  const removeSeat = (index: number) => {
    setSelectedSeats((prev) => prev.filter((_, i) => i !== index));
  };

  const getShowtimeDisplay = (func: FunctionType) => {
    const movie = movies.find((m) => m.movieId === func.movieId);
    const theater = theaters.find((t) => t.theaterId === func.theaterId);
    return `${movie?.title} - ${
      theater?.theaterNumber
    } - ${func.datetime.toLocaleString()}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Manual Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Manual Ticket</DialogTitle>
          <DialogDescription>
            Create a ticket manually for administrative purposes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="showtime" className="text-right">
                Showtime *
              </Label>
              <Select
                value={formData.functionId}
                onValueChange={(value) =>
                  handleInputChange("functionId", value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select showtime" />
                </SelectTrigger>
                <SelectContent>
                  {functions.map((func) => (
                    <SelectItem key={func.functionId} value={func.functionId}>
                      {getShowtimeDisplay(func)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userName" className="text-right">
                Customer Name *
              </Label>
              <Input
                id="userName"
                value={formData.userName}
                onChange={(e) => handleInputChange("userName", e.target.value)}
                className="col-span-3"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userEmail" className="text-right">
                Customer Email
              </Label>
              <Input
                id="userEmail"
                type="email"
                value={formData.userEmail}
                onChange={(e) => handleInputChange("userEmail", e.target.value)}
                className="col-span-3"
                placeholder="john@example.com"
              />
            </div>

            {/* Seat Selection */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Seats *</Label>
              <div className="col-span-3 space-y-3">
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
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Selected Seats:
                    </Label>
                    <div className="flex flex-wrap gap-2">
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
                            title="Mark seat as unavailable"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
