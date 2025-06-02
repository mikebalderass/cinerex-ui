import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { FunctionType } from "@/lib/types";
import { useParams } from "next/navigation";

export function useFunctions() {
    const [functions, setFunctions] = useState<FunctionType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const getFunctions = async () => {
        setLoading(true);
        setError(null);
        try {
        const response = await api.get("/functions");
        console.log("Funciones obtenidas:", response.data);
        setFunctions(response.data);
        } catch (err) {
        if (err instanceof AxiosError) {
            setError(err.message);
        } else {
            setError("Ocurrió un error inesperado al obtener las funciones.");
        }
        } finally {
        setLoading(false);
        }
    };
    
    useEffect(() => {
        getFunctions();
    }, []);
    
    return {
        functions,
        loading,
        error,
        getFunctions,
    };
}

export function useFunction(id?: string) {
    const { functionId } = useParams();
    const [functionData, setFunctionData] = useState<{
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
        seats?: {
            functionId: string;
            seatId: string;
            row_letter: string;
            seat_number: number;
            status: "AVAILABLE" | "SOLD";
        }[];
        tickets?: {
            ticketId: string;
            userName: string;
            purchaseDate: Date;
            seats: { row_letter: string; seat_number: number }[];
        }[];
    } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getFunction = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/functions/${id ? id : functionId}`);
            console.log("Función obtenida:", response.data);
            setFunctionData(response.data);
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.message);
            } else {
                setError("Ocurrió un error inesperado al obtener la función.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (functionId || id) {
            getFunction();
        }
    }, [functionId, id]);

    return {
        functionData,
        loading,
        error,
        getFunction,
    };
}