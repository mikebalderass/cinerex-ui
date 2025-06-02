"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Film,
  Calendar,
  Ticket,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  LogOut,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/auth-context";
import { CreateMovieModal } from "@/components/admin/create-movie";
import { CreateTheaterModal } from "@/components/admin/create-theater";
import { CreateShowtimeModal } from "@/components/admin/create-showtime";
import { CreateTicketModal } from "@/components/admin/create-ticket";
import type {
  MovieType,
  FunctionType,
  TheaterType,
  TicketType,
} from "@/lib/types";
import { useMovies } from "@/hooks/use-movies";
import { useTheaters } from "@/hooks/use-theaters";
import { useTickets } from "@/hooks/use-tickets";
import { useFunctions } from "@/hooks/use-functions";
import { toast } from "sonner";
import { UpdateMovieModal } from "@/components/admin/update-movie";
import { UpdateShowtimeModal } from "@/components/admin/update-showtime";
import { UpdateTheaterModal } from "@/components/admin/update-theater";
import { UpdateTicketModal } from "@/components/admin/update-ticket";
import { DeleteMovieModal } from "@/components/admin/delete-movie";

export default function AdminDashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const { movies, loading: moviesLoading, getMovies } = useMovies();
  const { theaters, loading: theatersLoading, getTheaters } = useTheaters();
  const { tickets, loading: ticketsLoading, getTickets } = useTickets();
  const { functions, loading: functionsLoading, getFunctions } = useFunctions();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role[0] !== "Admin") {
      router.push("/unauthorized");
      return;
    }
  }, [user, isLoading, router]);

  const formatDateTime = (datetime: Date): string => {
    const date = new Date(datetime);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getMovieTitle = (movieId: string): string => {
    return movies.find((m) => m.movieId === movieId)?.title || "Unknown Movie";
  };

  const getTheaterName = (theaterId: string): string => {
    return (
      theaters.find((t) => t.theaterId === theaterId)?.theaterNumber ||
      "Unknown Theater"
    );
  };

  const handleLogout = () => {
    logout();
  };

  // Calculate statistics
  const totalRevenue = tickets.length * 12.0; // Assuming $12 per ticket
  const totalTicketsSold = tickets.reduce(
    (sum, ticket) => sum + ticket.seats.length,
    0
  );
  const totalMovies = movies.length;
  const totalShowtimes = functions.length;

  const handleMovieAction = (message: string) => {
    getMovies();
    toast.success(message);
  }

  const handleShowtimeAction = (message: string) => {
    getFunctions();
    toast.success(message);
  };

  const handleTheaterAction = (message: string) => {
    getTheaters();
    toast.success(message);
  };

  const handleTicketAction = (message: string) => {
    getTickets();
    toast.success(message);
  };

  if (isLoading || moviesLoading || theatersLoading || ticketsLoading || functionsLoading) {
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
      <header className="border-b bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="flex items-center space-x-2">
                <Ticket className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">CineRex Admin</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tickets Sold
              </CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTicketsSold}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Movies
              </CardTitle>
              <Film className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMovies}</div>
              <p className="text-xs text-muted-foreground">2 new this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Showtimes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalShowtimes}</div>
              <p className="text-xs text-muted-foreground">Today's schedule</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="movies">Movies</TabsTrigger>
            <TabsTrigger value="showtimes">Showtimes</TabsTrigger>
            <TabsTrigger value="theaters">Theaters</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tickets.slice(0, 5).map((ticket) => (
                      <div
                        key={ticket.ticketId}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{ticket.userName}</p>
                          <p className="text-sm text-muted-foreground">
                            {getMovieTitle(
                              functions.find(
                                (f) => f.functionId === ticket.functionId
                              )?.movieId || ""
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {ticket.seats.length} seats
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(ticket.purchaseDate)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Today's Showtimes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {functions.slice(0, 5).map((func) => (
                      <div
                        key={func.functionId}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">
                            {getMovieTitle(func.movieId)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {getTheaterName(func.theaterId)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatDateTime(func.datetime)}
                          </p>
                          <Badge variant="outline">Active</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Movies Tab */}
          <TabsContent value="movies" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Movies Management</h2>
              <CreateMovieModal onMovieCreated={handleMovieAction} />
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movies.map((movie) => (
                    <TableRow key={movie.movieId}>
                      <TableCell className="font-medium">
                        {movie.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{movie.rating}</Badge>
                      </TableCell>
                      <TableCell>{formatDuration(movie.duration)}</TableCell>
                      <TableCell>
                        <Badge variant="default">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <UpdateMovieModal onMovieUpdate={handleMovieAction} movieId={movie.movieId} />
                          <DeleteMovieModal movieId={movie.movieId} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Showtimes Tab */}
          <TabsContent value="showtimes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Showtimes Management</h2>
              <CreateShowtimeModal
                movies={movies}
                theaters={theaters}
                onShowtimeCreated={handleShowtimeAction}
              />
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Movie</TableHead>
                    <TableHead>Theater</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {functions.map((func) => (
                    <TableRow key={func.functionId}>
                      <TableCell className="font-medium">
                        {getMovieTitle(func.movieId)}
                      </TableCell>
                      <TableCell>{getTheaterName(func.theaterId)}</TableCell>
                      <TableCell>{formatDateTime(func.datetime)}</TableCell>
                      <TableCell>
                        <Badge variant="default">Scheduled</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <UpdateShowtimeModal showtimeId={func.functionId} movies={movies} theaters={theaters} onShowtimeUpdated={handleShowtimeAction} />
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Theaters Tab */}
          <TabsContent value="theaters" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Theaters Management</h2>
              <CreateTheaterModal onTheaterCreated={handleTheaterAction} />
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Theater Name</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Today's Shows</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {theaters.map((theater) => {
                    const theaterShows = functions.filter(
                      (f) => f.theaterId === theater.theaterId
                    ).length;
                    return (
                      <TableRow key={theater.theaterId}>
                        <TableCell className="font-medium">
                          {theater.theaterNumber}
                        </TableCell>
                        <TableCell>120 seats</TableCell>
                        <TableCell>{theaterShows} shows</TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <UpdateTheaterModal theaterId={theater.theaterId} onTheaterUpdated={handleTheaterAction} />
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Bookings Management</h2>
              <div className="flex space-x-2">
                <CreateTicketModal
                  functions={functions}
                  movies={movies}
                  theaters={theaters}
                  onTicketCreated={handleTicketAction}
                />
                <Button variant="outline">Export</Button>
                <Button variant="outline">Filter</Button>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Movie</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.ticketId}>
                      <TableCell className="font-mono text-sm">
                        {ticket.ticketId}
                      </TableCell>
                      <TableCell className="font-medium">
                        {ticket.userName}
                      </TableCell>
                      <TableCell>
                        {getMovieTitle(
                          functions.find(
                            (f) => f.functionId === ticket.functionId
                          )?.movieId || ""
                        )}
                      </TableCell>
                      <TableCell>
                        {ticket.seats
                          .map(
                            (seat) => `${seat.row_letter}${seat.seat_number}`
                          )
                          .join(", ")}
                      </TableCell>
                      <TableCell>
                        {formatDateTime(ticket.purchaseDate)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <UpdateTicketModal ticketId={ticket.ticketId} movies={movies} functions={functions} theaters={theaters} onUpdated={handleTicketAction} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
