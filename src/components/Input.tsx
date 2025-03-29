import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { TextComponent } from "./Text";

type InputProps = {
  error?: boolean;
  textError?: string;
} & TextInputProps;

export const Input = ({ error, textError, ...rest }: InputProps) => {
  return (
    <>
      <TextInput style={styles.input} {...rest} />
      {error && <TextComponent style={styles.errorMessage}>{textError}</TextComponent>}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    marginBottom: 10,
  },

  errorMessage: {
    color: "red",
    marginBottom: 10,
  },
});
