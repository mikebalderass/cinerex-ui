import { api } from "@/lib/api";

export async function createTheater(theaterNumber: number) {
  try {
    const newTheater = {
      theaterNumber,
    };

    const response = await api.post("/theaters", newTheater);

    if (response.status !== 201) {
      throw new Error("Error al crear el teatro");
    }

    return response.data;
  } catch (error) {
    console.error("Error al crear el teatro:", error);
    throw error;
  }
}

export async function updateTheater(theaterId: string, theaterNumber: number) {
  try {
    const updatedTheater = {
      theaterNumber,
    };

    const response = await api.patch(`/theaters/${theaterId}`, updatedTheater);

    if (response.status !== 200) {
      throw new Error("Error al actualizar el teatro");
    }

    return response.data;
  } catch (error) {
    console.error("Error al actualizar el teatro:", error);
    throw error;
  }
}

export async function deleteTheater(theaterId: string) {
  try {
    const response = await api.delete(`/theaters/${theaterId}`);

    if (response.status !== 204) {
      throw new Error("Error al eliminar el teatro");
    }
  } catch (error) {
    console.error("Error al eliminar el teatro:", error);
    throw error;
  }
}
