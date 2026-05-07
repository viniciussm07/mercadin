import { View } from "react-native";
import { Button, type ButtonProps } from "@components/button";
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
import { ShoppingList } from "@services/shopping-lists/types";
import { useCreateShoppingListDialog } from "./hooks";

type CreateShoppingListDialogProps = {
  description?: string;
  navigateToDetails?: boolean;
  onCreated?: (list: ShoppingList) => void;
  placeholder?: string;
  title?: string;
  triggerClassName?: string;
  triggerLabel?: string;
  triggerSize?: ButtonProps["size"];
  triggerVariant?: ButtonProps["variant"];
};

export const CreateShoppingListDialog = ({
  description = "Dê um nome para a lista antes de começar a organizar suas compras.",
  navigateToDetails,
  onCreated,
  placeholder = "Ex: Compra da semana",
  title = "Criar lista inteligente",
  triggerClassName = "self-start w-full",
  triggerLabel = "Criar nova lista inteligente",
  triggerSize = "xl",
  triggerVariant = "default",
}: CreateShoppingListDialogProps) => {
  const { error, isCreating, name, onChangeName, onConfirm, open, onOpenChange } =
    useCreateShoppingListDialog({ navigateToDetails, onCreated });
  const triggerIconClassName =
    triggerVariant === "default" || triggerVariant === "destructive"
      ? "text-primary-foreground"
      : "text-foreground";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className={triggerClassName} size={triggerSize} variant={triggerVariant}>
          <Icon name="Plus" size={16} className={triggerIconClassName} />
          <Text>{triggerLabel}</Text>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <View className="gap-2">
          <Input
            value={name}
            placeholder={placeholder}
            returnKeyType="done"
            onChangeText={onChangeName}
            onSubmitEditing={() => void onConfirm()}
          />
          {error ? <Text className="font-questrial text-sm text-destructive">{error}</Text> : null}
        </View>

        <DialogFooter>
          <Button variant="outline" disabled={isCreating} onPress={() => onOpenChange(false)}>
            <Text>Cancelar</Text>
          </Button>
          <Button disabled={isCreating} onPress={() => void onConfirm()}>
            <Icon name="Plus" size={16} className="text-primary-foreground" />
            <Text>{isCreating ? "Criando..." : "Criar lista"}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
