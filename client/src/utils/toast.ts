import Toast from "react-native-toast-message";

type ShowToastParams = {
  title: string;
  message?: string;
  type?: "success" | "error" | "info";
};

export const showToast = ({ title, message, type = "success" }: ShowToastParams) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
  });
};
