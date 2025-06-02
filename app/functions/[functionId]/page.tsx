"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { SeatType } from "@/lib/types";
import { toast } from "sonner";
import { useFunction } from "@/hooks/use-functions";
import { useAuth } from "@/contexts/auth-context";
import { createTicket } from "@/actions/tickets";

interface SelectedSeat {
  seatId: string;
  row_letter: string;
  seat_number: number;
}

interface UserInfo {
  name: string;
  email: string;
  phone: string;
}

export default function TicketPage() {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const { user, isLoading } = useAuth();
  const [seats, setSeats] = useState<SeatType[]>([]);
  const [isProcessing, setPurchasing] = useState(false);
  const { functionData, loading } = useFunction();

  useEffect(() => {
    if (functionData && functionData.seats) {
      setSeats(functionData.seats);
    }
  }, [functionData]);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDateTime = (datetime: Date): string => {
    const date = new Date(datetime);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (datetime: Date): string => {
    const date = new Date(datetime);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSeatClick = (seat: SeatType) => {
    if (seat.status === "SOLD") return;

    const isSelected = selectedSeats.some((s) => s.seatId === seat.seatId);

    if (isSelected) {
      // Remove seat from selection
      setSelectedSeats(selectedSeats.filter((s) => s.seatId !== seat.seatId));
    } else {
      // Add seat to selection (limit to 8 seats)
      if (selectedSeats.length < 8) {
        setSelectedSeats([
          ...selectedSeats,
          {
            seatId: seat.seatId,
            row_letter: seat.row_letter,
            seat_number: seat.seat_number,
          },
        ]);
      } else {
        toast.error("Maximum seats reached", {
          description: "You can select up to 8 seats per booking.",
        });
      }
    }
  };

  const getSeatStatus = (seat: SeatType): "available" | "sold" | "selected" => {
    if (seat.status === "SOLD") return "sold";
    if (selectedSeats.some((s) => s.seatId === seat.seatId)) return "selected";
    return "available";
  };

  const getSeatClassName = (
    status: "available" | "sold" | "selected"
  ): string => {
    switch (status) {
      case "available":
        return "bg-green-100 hover:bg-green-200 text-green-800 border border-green-300 cursor-pointer";
      case "sold":
        return "bg-red-100 text-red-800 border border-red-300 cursor-not-allowed";
      case "selected":
        return "bg-blue-100 text-blue-800 border border-blue-300 cursor-pointer";
      default:
        return "";
    }
  };

  const ticketPrice = 12.0;
  const serviceFee = 2.5;
  const subtotal = selectedSeats.length * ticketPrice;
  const totalServiceFee = selectedSeats.length > 0 ? serviceFee : 0;
  const total = subtotal + totalServiceFee;

  const handlePurchase = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Asientos no seleccionados", {
        description:
          "Por favor, selecciona al menos un asiento para continuar.",
      });
      return;
    }

    if (!user) {
      toast.error("Información faltante", {
        description: "Por favor, inicia sesión para completar la compra.",
      });
      return;
    }

    if (!functionData) {
      toast.error("Función no encontrada", {
        description: "No se pudo encontrar la función seleccionada.",
      });
      return;
    }

    setPurchasing(true);

    try {
      const ticket = await createTicket(
        functionData.functionId,
        new Date().toISOString(),
        user.name,
        selectedSeats.map((s) => ({
          row_letter: s.row_letter,
          seat_number: s.seat_number,
        }))
      );

      toast("¡Compra exitosa!", {
        description: `Tu ticket ha sido creado con éxito. Ticket ID: ${ticket.ticketId}`,
      });
      // Redirect to confirmation page (you can create this route)
      router.push(`/tickets/${ticket.ticketId}`);
    } catch (error) {
      toast.error("Compra fallida", {
        description:
          "Ocurrió un error al procesar tu compra. Por favor, inténtalo de nuevo más tarde.",
      });
    } finally {
      setPurchasing(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Ticket className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">CineRex</span>
              </Link>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a películas
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Movie Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Movie Details */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <Image
                    src={
                      functionData?.movie.poster ||
                      "/placeholder.svg?height=300&width=200"
                    }
                    alt={functionData?.movie.title || "Movie Poster"}
                    width={200}
                    height={300}
                    className="rounded-lg shadow-lg"
                  />
                  <div className="flex-1 space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">
                        {functionData?.movie.title}
                      </h1>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <Badge variant="outline">
                          {functionData?.movie.rating}
                        </Badge>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDuration(functionData?.movie.duration || 0)}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      {functionData?.movie.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">
                          {formatDateTime(functionData?.datetime || new Date())}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">
                          {formatTime(functionData?.datetime || new Date())}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">
                          {functionData?.theater.theaterNumber}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">
                          {functionData?.seats?.length} asientos disponibles
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seat Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Seleccionar asientos</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Presiona un asiento para seleccionarlo. Puedes seleccionar
                  hasta 8 asientos.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Screen */}
                  <div className="text-center">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg py-2 px-8 inline-block mb-4">
                      <span className="text-sm font-medium">PANTALLA</span>
                    </div>
                  </div>

                  {/* Seat Map */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-10 gap-2">
                      {seats.map((seat) => {
                        const status = getSeatStatus(seat);
                        return (
                          <button
                            key={seat.seatId}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${getSeatClassName(
                              status
                            )}`}
                            onClick={() => handleSeatClick(seat)}
                            disabled={status === "sold"}
                          >
                            {seat.row_letter}
                            {seat.seat_number}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                      <span>Disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                      <span>Vendido</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                      <span>Seleccionado</span>
                    </div>
                  </div>

                  {/* Selected Seats Display */}
                  {selectedSeats.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="text-sm font-medium mb-2">
                        Asientos seleccionados:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSeats.map((seat) => (
                          <Badge key={seat.seatId} variant="secondary">
                            {seat.row_letter}
                            {seat.seat_number}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de boletos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">{functionData?.movie.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {functionData?.theater.theaterNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(functionData?.datetime || new Date())}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Asientos seleccionados:</span>
                    <span>
                      {selectedSeats.length > 0
                        ? selectedSeats
                            .map((s) => `${s.row_letter}${s.seat_number}`)
                            .join(", ")
                        : "None"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Boletos ({selectedSeats.length}):</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>
                      Cargo por servicio ({selectedSeats.length} asiento(s)):
                    </span>
                    <span>${totalServiceFee.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-blue-700"
                  disabled={
                    selectedSeats.length === 0 ||
                    isProcessing ||
                    !user?.name ||
                    !user?.email
                  }
                  onClick={handlePurchase}
                >
                  <Ticket className="h-4 w-4 mr-2" />
                  {isProcessing ? "Procesando..." : "Completar compra"}
                </Button>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información del cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h2>{user?.name}</h2>
                </div>
                <div className="space-y-2">
                  <h2>{user?.email}</h2>
                </div>
                <div className="space-y-2">
                  <h2>{user?.username}</h2>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
