import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { TicketType } from "@/lib/types";
import { useParams } from "next/navigation";

export function useTickets() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/tickets");
      console.log("Tickets obtenidos:", response.data);
      setTickets(response.data);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al obtener los tickets.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTickets();
  }, []);

  return {
    tickets,
    loading,
    error,
    getTickets,
  };
}

export function useTicket(id?: string) {
  const { ticketId } = useParams();

  const [ticketData, setTicketData] = useState<{
    ticketId: string;
    functionId: string;
    function: {
        functionId: string;
        movieId: string;
        movie: {
            movieId: string;
            title: string;
            description: string;
            duration: number;
            rating: string;
            poster?: string | null;
        };
        theaterId: string;
        theater: {
            theaterId: string;
            theaterNumber: string;
        };
        datetime: Date;
    }
    purchaseDate: Date;
    userName: string;
    seats: { row_letter: string; seat_number: number }[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getTicket = async () => {
    if (!ticketId) {
      setError("ID de ticket no proporcionado");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/tickets/${id ? id : ticketId}`);
      console.log("Ticket obtenido:", response.data);
      setTicketData(response.data);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al obtener el ticket.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId || id) {
      getTicket();
    }
  }, [ticketId, id]);

  return {
    ticketData,
    loading,
    error,
    getTicket,
  };
}
