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
import { useChangePasswordDialog } from "./hooks";

const passwordFields = [
  { name: "currentPassword", label: "Senha atual", placeholder: "Sua senha atual" },
  { name: "newPassword", label: "Nova senha", placeholder: "Nova senha" },
  { name: "newPasswordConfirmation", label: "Repita a nova senha", placeholder: "Nova senha" },
] as const;

export const ChangePasswordDialog = () => {
  const { form, isSubmitting, onOpenChange, open, submitError } = useChangePasswordDialog();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Icon name="LockKeyhole" size={16} className="text-primary" />
          <Text>Alterar senha</Text>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar senha</DialogTitle>
          <DialogDescription>Valide sua senha atual e informe a nova senha.</DialogDescription>
        </DialogHeader>

        {passwordFields.map(item => (
          <form.Field key={item.name} name={item.name}>
            {field => {
              const errorMessage = getFieldErrorMessage(field.state.meta.errors);

              return (
                <View className="gap-2">
                  <Text className="font-semibold text-foreground">{item.label}</Text>
                  <Input
                    value={field.state.value}
                    placeholder={item.placeholder}
                    secureTextEntry
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
        ))}

        {submitError ? (
          <Text className="font-questrial text-sm text-destructive">{submitError}</Text>
        ) : null}

        <DialogFooter>
          <Button variant="outline" disabled={isSubmitting} onPress={() => onOpenChange(false)}>
            <Text>Cancelar</Text>
          </Button>
          <Button disabled={isSubmitting} onPress={form.handleSubmit}>
            <Text>{isSubmitting ? "Salvando..." : "Salvar senha"}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
