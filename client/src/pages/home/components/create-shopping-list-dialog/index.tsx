import { View } from "react-native";
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
import { Input } from "@components/input";
import { Text } from "@components/text";
import { useCreateShoppingListDialog } from "./hooks";

export const CreateShoppingListDialog = () => {
  const { error, isCreating, name, onChangeName, onConfirm, open, onOpenChange } =
    useCreateShoppingListDialog();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="self-start w-full" size="xl">
          <Icon name="Plus" size={16} className="text-primary-foreground" />
          <Text>Criar nova lista inteligente</Text>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar lista inteligente</DialogTitle>
          <DialogDescription>
            Dê um nome para a lista antes de começar a organizar suas compras.
          </DialogDescription>
        </DialogHeader>

        <View className="gap-2">
          <Input
            value={name}
            placeholder="Ex: Compra da semana"
            returnKeyType="done"
            onChangeText={onChangeName}
            onSubmitEditing={onConfirm}
          />
          {error ? <Text className="font-questrial text-sm text-destructive">{error}</Text> : null}
        </View>

        <DialogFooter>
          <Button variant="outline" disabled={isCreating} onPress={onOpenChange}>
            <Text>Cancelar</Text>
          </Button>
          <Button disabled={isCreating} onPress={onConfirm}>
            <Icon name="Plus" size={16} className="text-primary-foreground" />
            <Text>{isCreating ? "Criando..." : "Criar lista"}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
