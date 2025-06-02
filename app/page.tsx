"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, LogOut, MapPin, Search, Star, Ticket, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { MovieType, FunctionType, TheaterType } from "@/lib/types";
import { useEffect, useState } from "react";
import { useMovies } from "@/hooks/use-movies";
import { useTheaters } from "@/hooks/use-theaters";
import { useFunctions } from "@/hooks/use-functions";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function CinemaHomepage() {
  const [featuredMovie, setFeaturedMovie] = useState<MovieType | undefined>();
  const { movies, loading: moviesLoading } = useMovies();
  const { theaters, loading: theatersLoading } = useTheaters();
  const { functions, loading: functionsLoading } = useFunctions();
  const { user, isLoading: userLoading, logout } = useAuth();
  const router = useRouter();

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatShowtime = (datetime: Date): string => {
    const date = new Date(datetime);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getTheaterName = (theaterId: string): string => {
    const theater = theaters.find((t) => t.theaterId === theaterId);
    return theater?.theaterNumber || "Unknown Theater";
  };

  const getAvailableSeats = (functionItem: FunctionType): number => {
    if (!functionItem.seats) return 120; // Default seat count
    return functionItem.seats.filter((seat) => seat.status === "AVAILABLE")
      .length;
  };

  const handleLogout = () => {
    if (user) {
      logout();
      router.push("/login");
    }
  }

  useEffect(() => {
    if (movies && movies.length > 0) {
      setFeaturedMovie(movies[0]);
    }
  }, [movies]);

  if (moviesLoading || theatersLoading || functionsLoading || userLoading) {
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
        <div className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Ticket className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">CineRex</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/signup">
                  <Button size="sm">Registrarse</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[550px] overflow-hidden">
        <Image
          src={
            featuredMovie?.poster || "/placeholder.svg?height=550&width=1200"
          }
          alt={featuredMovie?.title || "Featured Movie"}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 container mx-auto px-8 flex items-center">
          <div className="grid md:grid-cols-2 gap-8 items-center w-full">
            <div className="text-white space-y-4">
              <Badge variant="secondary" className="w-fit">
                Película Destacada
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold">
                {featuredMovie?.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm">
                <span className="bg-yellow-600 px-2 py-1 rounded">
                  {featuredMovie?.rating}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDuration(featuredMovie?.duration || 120)}
                </span>
              </div>
              <p className="text-lg text-gray-200 max-w-lg">
                {featuredMovie?.description}
              </p>

              {/* Show available functions */}
              {featuredMovie?.functions &&
                featuredMovie.functions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Funciones de hoy:</p>
                    <div className="flex flex-wrap gap-2">
                      {featuredMovie.functions.slice(0, 3).map((func) => (
                        <Link
                          key={func.functionId}
                          href={`/functions/${func.functionId}`}
                        >
                          <Button
                            variant="outline"
                            className="bg-white text-primary hover:bg-primary hover:text-white flex flex-col items-start p-3 h-auto cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {formatShowtime(func.datetime)}
                              </span>
                              <span className="text-xs opacity-80">
                                {getTheaterName(func.theaterId)}
                              </span>
                            </div>
                            <span className="text-xs opacity-80 flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {getAvailableSeats(func)} asientos disponibles
                            </span>
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

              <Link href={`/movies/${featuredMovie?.movieId || ""}`}>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-blue-800"
                  disabled={!featuredMovie?.functions?.[0]}
                >
                  <Ticket className="h-4 w-4 mr-2" />
                  Buscar Boletos
                </Button>
              </Link>
            </div>
            <div className="hidden md:block">
              <Image
                src={
                  featuredMovie?.poster ||
                  "/placeholder.svg?height=450&width=300"
                }
                alt={featuredMovie?.title || "Featured Movie Poster"}
                width={300}
                height={450}
                className="rounded-lg shadow-2xl ml-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Movies Section */}
      <section className="container mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Películas</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {movies &&
            movies.length > 0 &&
            movies.map((movie) => (
              <Card
                key={movie.movieId}
                className="group cursor-pointer hover:shadow-lg transition-shadow py-0"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={
                        movie.poster || "/placeholder.svg?height=400&width=300"
                      }
                      alt={movie.title}
                      width={300}
                      height={400}
                      className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {movie.rating}
                    </div>
                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDuration(movie.duration)}
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="space-y-1">
                      <h3 className="font-semibold line-clamp-2">
                        {movie.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {movie.description}
                      </p>
                    </div>
                    {/* Show functions if available */}
                    {movie.functions && movie.functions.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs font-medium">Funciones de hoy:</p>
                        <div className="flex flex-wrap gap-1">
                          {movie.functions.slice(0, 3).map((func) => (
                            <Badge
                              key={func.functionId}
                              variant="outline"
                              className="text-xs px-2 py-0"
                            >
                              {formatShowtime(func.datetime)}
                            </Badge>
                          ))}
                          {movie.functions.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-0"
                            >
                              +{movie.functions.length - 3}
                            </Badge>
                          )}
                        </div>
                        <Button
                          size="sm"
                          className="w-full bg-primary hover:bg-blue-800 cursor-pointer"
                          disabled={!movie.functions?.[0]}
                          asChild
                        >
                          <Link href={`/movies/${movie.movieId || ""}`}>
                            Book Now
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Badge
                          variant="secondary"
                          className="text-xs px-2 py-0"
                        >
                          Muy pronto
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <Link href={`/movies/${movie.movieId || ""}`}>
                            Ver Detalles
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white px-8 py-16">
        <div className="flex flex-col justify-center w-full">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Ticket className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CineMax</span>
          </div>
          <p className="text-sm text-gray-400 text-center">
            Tu destino para las mejores películas y experiencias de cine. Compra
            boletos, descubre horarios y disfruta de una experiencia
            cinematográfica inolvidable.
          </p>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2023 CineMax. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
