import { api } from "@/lib/api";

export async function createShowtime(movieId: string, theaterId: string, datetime: Date) {
  try {
    const newShowtime = {
      movieId,
      theaterId,
      datetime,
    };

    const response = await api.post("/functions", newShowtime);

    if (response.status !== 201) {
      throw new Error("Error al crear la función");
    }

    return response.data;
  } catch (error) {
    console.error("Error al crear la función:", error);
    throw error;
  }
}

export async function updateShowtime(showtimeId: string, movieId: string, theaterId: string, datetime: Date) {
  try {
    const updatedShowtime = {
      movieId,
      theaterId,
      datetime,
    };

    const response = await api.patch(`/functions/${showtimeId}`, updatedShowtime);

    if (response.status !== 200) {
      throw new Error("Error al actualizar la función");
    }

    return response.data;
  } catch (error) {
    console.error("Error al actualizar la función:", error);
    throw error;
  }
}

export async function deleteShowtime(showtimeId: string) {
  try {
    const response = await api.delete(`/functions/${showtimeId}`);

    if (response.status !== 204) {
      throw new Error("Error al eliminar la función");
    }
  } catch (error) {
    console.error("Error al eliminar la función:", error);
    throw error;
  }
}
