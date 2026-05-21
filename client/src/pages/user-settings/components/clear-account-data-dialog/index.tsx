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
import { useClearAccountDataDialog } from "./hooks";

export const ClearAccountDataDialog = () => {
  const { confirm, isSubmitting, open, setOpen, submitError } = useClearAccountDataDialog();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Icon name="Eraser" size={16} className="text-primary" />
          <Text>Limpar dados da conta</Text>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Limpar dados da conta</DialogTitle>
          <DialogDescription>
            Isso removerá apenas suas listas salvas por enquanto.
          </DialogDescription>
        </DialogHeader>

        {submitError ? (
          <Text className="font-questrial text-sm text-destructive">{submitError}</Text>
        ) : null}

        <DialogFooter>
          <Button variant="outline" disabled={isSubmitting} onPress={() => setOpen(false)}>
            <Text>Cancelar</Text>
          </Button>
          <Button variant="destructive" disabled={isSubmitting} onPress={() => void confirm()}>
            <Icon name="Trash2" size={16} className="text-white" />
            <Text>{isSubmitting ? "Limpando..." : "Limpar dados"}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
