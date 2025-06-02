import { deleteMovie } from "@/actions/movies";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "sonner";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Trash } from "lucide-react";

export function DeleteMovieModal({ movieId }: { movieId: string }) {
  const handleDelete = async () => {
    try {
      await deleteMovie(movieId);
      toast.success("Película eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar la película:", error);
      toast.error("Error al eliminar la película");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Eliminar Película</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar esta película? Esta acción no
            se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
