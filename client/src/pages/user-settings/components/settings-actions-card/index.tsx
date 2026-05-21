import { Card, CardContent, CardFooter, CardHeader } from "@components/card";
import { Text } from "@components/text";
import { ChangeEmailDialog } from "../change-email-dialog";
import { ChangePasswordDialog } from "../change-password-dialog";
import { ClearAccountDataDialog } from "../clear-account-data-dialog";
import { DeleteAccountDialog } from "../delete-account-dialog";

type SettingsActionsCardProps = {
  currentEmail: string;
};

export const SettingsActionsCard = ({ currentEmail }: SettingsActionsCardProps) => {
  return (
    <Card className="min-h-[360px] flex-1 justify-between overflow-hidden rounded-[32px] border-border/60 bg-white py-0 shadow-sm">
      <CardHeader className="border-b border-border py-6">
        <Text className="text-3xl font-bold text-foreground">Configurações</Text>
      </CardHeader>

      <CardContent className="gap-4 py-6">
        <ChangeEmailDialog currentEmail={currentEmail} />
        <ChangePasswordDialog />
        <ClearAccountDataDialog />
      </CardContent>

      <CardFooter className="border-t border-border py-6">
        <DeleteAccountDialog />
      </CardFooter>
    </Card>
  );
};
