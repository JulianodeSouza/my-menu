import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { borderRadius, spacing } from "theme";
import { useTheme } from "~/contexts/ThemeContext";
import { InputProps } from "~/types/input";
import { onlyNumbers } from "~/utils/stringUtils";
import LabelInput from "./LabelInput";
import { TextComponent } from "./Text";

export const Input = ({
  label,
  error,
  inputStyle,
  textError,
  labelStyle,
  isRequired,
  mask,
  ...rest
}: InputProps) => {
  const { theme } = useTheme();
  const [maskedValue, setMaskedValue] = useState(rest.value ?? "");

  const getRawValue = (masked: string) => {
    if (!mask) return masked;
    return onlyNumbers(masked);
  };

  const handleChangeText = (text: string) => {
    let rawValue = text;
    if (mask) {
      rawValue = getRawValue(text);
    }
    const masked = mask ? mask(rawValue) : rawValue;
    setMaskedValue(masked);
    if (rest.onChangeText) rest.onChangeText(rawValue);
  };

  useEffect(() => {
    if (rest.value !== undefined) {
      setMaskedValue(mask ? mask(rest.value as string) : (rest.value as string));
    }
  }, [rest.value, mask]);

  return (
    <>
      <View style={styles.container}>
        <LabelInput text={label} isRequired={isRequired} />
        <TextInput
          style={[
            styles.input,
            {
              borderColor: theme.border,
              color: theme.text,
              backgroundColor: theme.inputBackground,
            },
          ]}
          {...rest}
          value={maskedValue}
          onChangeText={handleChangeText}
          placeholderTextColor={`${theme.text}`}
        />
        {error && (
          <TextComponent style={[styles.errorMessage, { color: theme.error }]}>
            {textError}
          </TextComponent>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  input: {
    borderWidth: 1,
    padding: spacing.base,
    marginBottom: spacing.md,
    borderRadius: borderRadius.sm,
  },
  errorMessage: {
    marginBottom: spacing.md,
  },
});
