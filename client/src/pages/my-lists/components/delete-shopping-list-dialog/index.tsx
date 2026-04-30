import { Button } from "@components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/dialog";
import { Icon } from "@components/icon";
import { Text } from "@components/text";

interface DeleteShoppingListDialogProps {
  isDeleting: boolean;
  listName?: string;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export const DeleteShoppingListDialog = ({
  isDeleting,
  listName = "esta lista",
  onConfirm,
  onOpenChange,
  open,
}: DeleteShoppingListDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir lista</DialogTitle>
          <DialogDescription>
            Deseja excluir "{listName}"? Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" disabled={isDeleting} onPress={() => onOpenChange(false)}>
            <Text>Cancelar</Text>
          </Button>
          <Button variant="destructive" disabled={isDeleting} onPress={onConfirm}>
            <Icon name="Trash2" size={16} className="text-white" />
            <Text>{isDeleting ? "Excluindo..." : "Excluir"}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
