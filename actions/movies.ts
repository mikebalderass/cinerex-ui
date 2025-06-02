import { api } from "@/lib/api";

export async function createMovie(title: string, description: string, duration: number, rating: number, poster: string) {
  try {
    const newMovie = {
        "title": title,
        "description": description,
        "duration": duration,
        "rating": rating,
        "poster": poster,
        "functions": []
    };

    const response = await api.post("/movies", newMovie);

    if (response.status !== 201) {
      throw new Error("Error al crear la película");
    }

    return response.data;
  } catch (error) {
    console.error("Error al crear la película:", error);
    throw error;
  }
}

export async function updateMovie(movieId: string, movieTitle: string, movieDescription: string, movieDuration: number, movieRating: number, moviePoster: string, functions: any[]) {
  try {
    const updatedMovie = {
      "title": movieTitle,
      "description": movieDescription,
      "duration": movieDuration,
      "rating": movieRating,
      "poster": moviePoster,
      "functions": functions
    };

    const response = await api.patch(`/movies/${movieId}`, updatedMovie);

    if (response.status !== 200) {
      throw new Error("Error al actualizar la película");
    }

    return response.data;
  } catch (error) {
    console.error("Error al actualizar la película:", error);
    throw error;
  }
}

export async function deleteMovie(movieId: string) {
  try {
    const response = await api.delete(`/movies/${movieId}`);

    if (response.status !== 204) {
      throw new Error("Error al eliminar la película");
    }

    return { success: true };
  } catch (error) {
    console.error("Error al eliminar la película:", error);
    throw error;
  }
}
