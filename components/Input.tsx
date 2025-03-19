import { StyleSheet, TextInput, TextInputProps } from "react-native";

export const Input = ({ ...rest }: TextInputProps) => {
  return <TextInput style={styles.input} {...rest} />;
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
  },
});
