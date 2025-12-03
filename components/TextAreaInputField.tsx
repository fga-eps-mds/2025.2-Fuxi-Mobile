import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

interface TextAreaFieldProps extends TextInputProps {
  placeholder?: string;
}

export function TextAreaInputField({ placeholder, ...props }: TextAreaFieldProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, props.style]} 
        placeholder={placeholder}
        placeholderTextColor="#989898"
        multiline={true}          
        numberOfLines={5}           
        textAlignVertical="top"   
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(17, 16, 17, 0.2)",
    backgroundColor: "#F5F8FF",
  },

  input: {
    fontFamily: "Roboto",
    fontSize: 17,
    color: "#1D1D1D",
    paddingHorizontal: 12,
    paddingVertical: 10,   
    minHeight: 120,      
  },
});
