import React from "react";
import { TextInput, StyleSheet, TextInputProps, View } from "react-native";

interface TextInputFieldProps extends TextInputProps {
  placeholder?: string;
}

export function TextInputField({ placeholder, ...props }: TextInputFieldProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#989898"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flexDirection: "column",
    width: "100%",
    height: 45,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(17, 16, 17, 0.2)",
    backgroundColor: "#F5F8FF",
    justifyContent: "center"
  },

  input: {
    fontFamily: "Roboto",
    fontSize: 17,
    color: "#1D1D1D",
    paddingHorizontal: 12,
  },
});
