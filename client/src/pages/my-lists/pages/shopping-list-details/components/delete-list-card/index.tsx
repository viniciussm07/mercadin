import { Button } from "@components/button";
import { Card, CardContent } from "@components/card";
import { Icon } from "@components/icon";
import { Text } from "@components/text";

interface DeleteListCardProps {
  isDeleting: boolean;
  onDelete: () => void;
}

export const DeleteListCard = ({ isDeleting, onDelete }: DeleteListCardProps) => {
  return (
    <Card className="bg-white py-5">
      <CardContent className="gap-3">
        <Text className="text-xl font-bold text-foreground">Excluir lista</Text>
        <Text className="font-questrial text-sm text-muted-foreground">
          A exclusão remove a lista e todos os itens associados.
        </Text>
        <Button
          variant="destructive"
          disabled={isDeleting}
          onPress={onDelete}
          className="self-start"
        >
          <Icon name="Trash2" size={16} className="text-white" />
          <Text>{isDeleting ? "Excluindo..." : "Excluir lista"}</Text>
        </Button>
      </CardContent>
    </Card>
  );
};
