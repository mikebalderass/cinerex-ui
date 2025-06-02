import { api } from "@/lib/api";
import { MovieType } from "@/lib/types";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useMovies() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<MovieType[]>("/movies");
      console.log("Películas obtenidas:", response.data);
      setMovies(response.data);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al obtener las películas.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return {
    movies,
    loading,
    error,
    getMovies,
  };
}

export function useMovie(id?: string) {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<{
    movieId: string;
    title: string;
    description: string;
    duration: number;
    rating: string;
    poster?: string | null;
    functions?: {
      functionId: string;
      movieId: string;
      theaterId: string;
      datetime: Date;
      theater: {
        theaterId: string;
        theaterNumber: string;
      };
    }[];
  }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getMovie = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/movies/${id ? id : movieId}`);
      console.log("Película obtenida:", response.data);
      setMovie(response.data);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al obtener la película.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movieId || id) {
      getMovie();
    }
  }, [movieId, id]);

  return {
    movie,
    loading,
    error,
    getMovie,
  };
}
