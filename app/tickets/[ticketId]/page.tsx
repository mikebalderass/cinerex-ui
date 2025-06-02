"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Download,
  Mail,
  CheckCircle,
  QrCode,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTicket } from "@/hooks/use-tickets";

export default function TicketPage() {
  const { ticketData, loading } = useTicket();

  if (loading) {
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-lg">Loading...</p>
      </div>
    </div>;
  }

  const ticketPrice = 12.0;
  const serviceFee = 2.5;
  const subtotal = (ticketData?.seats.length || 0) * ticketPrice;
  const totalServiceFee = serviceFee;
  const total = subtotal + totalServiceFee;

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Ticket className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">CineRex</span>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                Volver a películas
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Success Message */}
          <Card className="border-green-200 bg-green-50 dark:bg-green-950">
            <CardContent className="px-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <h1 className="text-2xl font-bold text-green-800 dark:text-green-200">
                    Compra confirmada!
                  </h1>
                  <p className="text-green-700 dark:text-green-300">
                    Tu compra ha sido exitosa. Aquí están los detalles de tus
                    boletos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Ticket Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Ticket className="h-5 w-5" />
                  <span>Detalles de tu compra</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Image
                    src={
                      ticketData?.function.movie?.poster ||
                      "/placeholder.svg?height=150&width=100"
                    }
                    alt={ticketData?.function.movie.title || "Movie Poster"}
                    width={100}
                    height={150}
                    className="rounded-lg shadow-md"
                  />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg">
                      {ticketData?.function.movie.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Badge variant="outline">
                        {ticketData?.function.movie.rating}
                      </Badge>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDuration(
                          ticketData?.function.movie.duration || 0
                        )}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {formatDateTime(
                            ticketData?.function.datetime || new Date()
                          )}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {formatTime(
                            ticketData?.function.datetime || new Date()
                          )}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {ticketData?.function.theater.theaterNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Asientos</h4>
                  <div className="flex flex-wrap gap-2">
                    {ticketData?.seats.map((seat, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm"
                      >
                        Row {seat.row_letter}, Seat {seat.seat_number}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Compra</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>ID de boleto:</span>
                      <span className="font-mono">{ticketData?.ticketId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cliente:</span>
                      <span>{ticketData?.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Purchase Date:</span>
                      <span>
                        {new Date(
                          ticketData?.purchaseDate || new Date()
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Code and Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Tus boletos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* QR Code Placeholder */}
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="size-48" />
                    </div>
                  </div>
                </div>

                <p className="text-sm text-center text-muted-foreground">
                  Muestra este código QR en la entrada del cine para escanear
                  tus boletos.
                </p>

                <Separator />

                {/* Payment Summary */}
                <div>
                  <h4 className="font-medium mb-2">Resumen de la compra</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Boletos ({ticketData?.seats.length}):</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar boletos
                  </Button>
                  <Link href="/" className="block">
                    <Button className="w-full bg-primary hover:bg-blue-700">
                      Buscar otra película
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Important Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información importante</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <h5 className="font-medium text-foreground mb-2">
                    Antes de tu llegada
                  </h5>
                  <ul className="space-y-1">
                    <li>• Llega 30 minutos antes de tu función</li>
                    <li>• Ten tu código listo para escanear</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-foreground mb-2">
                    Política de cancelación y cambios
                  </h5>
                  <ul className="space-y-1">
                    <li>• Cancelaciones hasta 24 horas antes de la función</li>
                    <li>• No se permiten cambios de fecha o película</li>
                    <li>• Contacta a soporte para más información</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
