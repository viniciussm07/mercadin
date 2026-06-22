import { Input } from "@components/input";

type ListSearchInputProps = {
  disabled: boolean;
  onChangeQuery: (query: string) => void;
  query: string;
};

export const ListSearchInput = ({ disabled, onChangeQuery, query }: ListSearchInputProps) => {
  return (
    <Input
      editable={!disabled}
      placeholder="Buscar lista"
      returnKeyType="search"
      value={query}
      onChangeText={onChangeQuery}
    />
  );
};
