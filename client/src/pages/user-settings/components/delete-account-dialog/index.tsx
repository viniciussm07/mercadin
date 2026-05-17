import { Button } from "@components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/dialog";
import { Icon } from "@components/icon";
import { Text } from "@components/text";
import { useDeleteAccountDialog } from "./hooks";

export const DeleteAccountDialog = () => {
  const { confirm, isSubmitting, open, setOpen, submitError } = useDeleteAccountDialog();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-destructive/30">
          <Icon name="UserX" size={16} className="text-destructive" />
          <Text className="text-destructive">Excluir conta</Text>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir conta</DialogTitle>
          <DialogDescription>
            Essa ação não pode ser desfeita. Sua conta será removida permanentemente.
          </DialogDescription>
        </DialogHeader>

        {submitError ? (
          <Text className="font-questrial text-sm text-destructive">{submitError}</Text>
        ) : null}

        <DialogFooter>
          <Button variant="outline" disabled={isSubmitting} onPress={() => setOpen(false)}>
            <Text>Cancelar</Text>
          </Button>
          <Button variant="destructive" disabled={isSubmitting} onPress={() => confirm()}>
            <Icon name="Trash2" size={16} className="text-white" />
            <Text>{isSubmitting ? "Excluindo..." : "Excluir conta"}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
