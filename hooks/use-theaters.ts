import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { TheaterType } from "@/lib/types";
import { useParams } from "next/navigation";

export function useTheaters() {
  const [theaters, setTheaters] = useState<TheaterType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getTheaters = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/theaters");
      console.log("Teatros obtenidos:", response.data);
      setTheaters(response.data);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al obtener los teatros.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTheaters();
  }, []);

  return {
    theaters,
    loading,
    error,
    getTheaters,
  };
}

export function useTheater(id?: string) {
  const { theaterId } = useParams();
  const [theaterData, setTheaterData] = useState<TheaterType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getTheater = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/theaters/${id ? id : theaterId}`);
      console.log("Teatro obtenido:", response.data);
      setTheaterData(response.data);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al obtener el teatro.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (theaterId || id) {
      getTheater();
    }
  }, [theaterId, id]);

  return {
    theaterData,
    loading,
    error,
    getTheater,
  };
}
