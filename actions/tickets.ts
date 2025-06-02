import { api } from "@/lib/api";

export async function createTicket(
  functionId: string,
  purchaseDate: string,
  userName: string,
  seats: { row_letter: string; seat_number: number }[]
) {
  try {
    const newTicket = {
      functionId,
      purchaseDate,
      seats,
      userName,
    };

    const response = await api.post("/tickets", newTicket);

    if (response.status !== 201) {
      throw new Error("Error al crear el ticket");
    }

    return response.data;
  } catch (error) {
    console.error("Error al crear el ticket:", error);
    throw error;
  }
}

export async function updateTicket(
  ticketId: string,
  functionId: string,
  purchaseDate: string,
  userName: string,
  seats: { row_letter: string; seat_number: number }[]
) {
  try {
    const updatedTicket = {
      functionId,
      purchaseDate,
      seats,
      userName,
    };

    const response = await api.patch(`/tickets/${ticketId}`, updatedTicket);

    if (response.status !== 200) {
      throw new Error("Error al actualizar el ticket");
    }

    return response.data;
  } catch (error) {
    console.error("Error al actualizar el ticket:", error);
    throw error;
  }
}

export async function deleteTicket(ticketId: string) {
  try {
    const response = await api.delete(`/tickets/${ticketId}`);

    if (response.status !== 204) {
      throw new Error("Error al eliminar el ticket");
    }
  } catch (error) {
    console.error("Error al eliminar el ticket:", error);
    throw error;
  }
}
