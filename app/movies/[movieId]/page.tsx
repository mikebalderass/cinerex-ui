"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Star, Theater, Ticket, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FunctionType, TheaterType } from "@/lib/types";
import { useMovie } from "@/hooks/use-movies";

export default function MoviePage() {
  const { movie, loading } = useMovie();
  const [functions, setFunctions] = useState<
    {
      functionId: string;
      movieId: string;
      theaterId: string;
      datetime: Date;
      theater?: TheaterType;
    }[]
  >([]);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (datetime: Date): string => {
    return datetime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getAvailableSeats = (func: FunctionType): number => {
    if (!func.seats) return 120; // Default seat count
    return func.seats.filter((seat) => seat.status === "AVAILABLE").length;
  };

  useEffect(() => {
    if (movie?.functions) {
      setFunctions(movie.functions);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
          <Link href="/">
            <Button>Back to Homepage</Button>
          </Link>
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
            <Link href="/" className="flex items-center space-x-2">
              <Ticket className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">CineRex</span>
            </Link>
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
                      movie.poster || "/placeholder.svg?height=400&width=300"
                    }
                    alt={movie.title}
                    width={300}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                  <div className="flex-1 space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <Badge variant="outline">{movie.rating}</Badge>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDuration(movie.duration)}
                        </span>
                        <span className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          {movie.rating} / 10
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {movie.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Showtimes */}
            <Card>
              <CardHeader>
                <CardTitle>Seleccionar función</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="today" className="w-full">
                  <TabsList className="justify-between">
                    <TabsTrigger value="today">Hoy</TabsTrigger>
                    <TabsTrigger value="tomorrow">Mañana</TabsTrigger>
                    <TabsTrigger value="week">Esta semana</TabsTrigger>
                  </TabsList>
                  <TabsContent value="today">
                    <div className="space-y-4">
                      {movie?.functions?.map((func) => (
                        <div
                          key={func.functionId}
                          className="flex items-center justify-between p-4 border-b"
                        >
                          <div className="flex items-center space-x-4">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <span>{formatTime(new Date(func.datetime))}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Theater className="h-5 w-5 text-muted-foreground" />
                            <span>
                              {func.theater?.theaterNumber || "Main Theater"}
                            </span>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/functions/${func.functionId}`}>
                              Reservar
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  {/* Add more TabsContent for tomorrow and week if needed */}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Book */}
            <Card>
              <CardHeader>
                <CardTitle>Reservar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Selecciona una función para reservar tus asientos.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Precio del boleto:</span>
                      <span className="font-medium">$12.00</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
