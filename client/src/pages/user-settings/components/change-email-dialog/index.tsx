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
import { getFieldErrorMessage } from "@utils/get-field-error-message";
import { View } from "react-native";
import { useChangeEmailDialog } from "./hooks";

type ChangeEmailDialogProps = {
  currentEmail: string;
};

export const ChangeEmailDialog = ({ currentEmail }: ChangeEmailDialogProps) => {
  const { form, isSubmitting, onOpenChange, open, submitError } =
    useChangeEmailDialog(currentEmail);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Icon name="Mail" size={16} className="text-primary" />
          <Text>Alterar e-mail</Text>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar e-mail</DialogTitle>
          <DialogDescription>Informe o novo e-mail da sua conta.</DialogDescription>
        </DialogHeader>

        <form.Field name="email">
          {field => {
            const errorMessage = getFieldErrorMessage(field.state.meta.errors);

            return (
              <View className="gap-2">
                <Text className="font-semibold text-foreground">Novo e-mail</Text>
                <Input
                  value={field.state.value}
                  placeholder="email@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={field.handleBlur}
                  onChangeText={field.handleChange}
                  onSubmitEditing={form.handleSubmit}
                />
                {errorMessage ? (
                  <Text className="font-questrial text-sm text-destructive">{errorMessage}</Text>
                ) : null}
              </View>
            );
          }}
        </form.Field>

        {submitError ? (
          <Text className="font-questrial text-sm text-destructive">{submitError}</Text>
        ) : null}

        <DialogFooter className="flex-row justify-between w-full">
          <Button variant="outline" disabled={isSubmitting} onPress={() => onOpenChange(false)}>
            <Text>Cancelar</Text>
          </Button>
          <Button disabled={isSubmitting} onPress={form.handleSubmit}>
            <Text>{isSubmitting ? "Salvando..." : "Salvar e-mail"}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
