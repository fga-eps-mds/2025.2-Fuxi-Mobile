// components/dropdownSelect.tsx
import React from "react";
import RNPickerSelect from "react-native-picker-select";
import { View, StyleSheet, ViewStyle, Platform } from "react-native";

interface Option { label: string; value: string; }

interface DropdownSelectProps {

  options: Option[];
  value: string | null;
  onSelect: (value: string) => void;
  placeholder?: string;
  style?: ViewStyle;

}

export function DropdownSelect({

  options,
  value,
  onSelect,
  placeholder = "Selecione uma opção",
  style,

}: DropdownSelectProps) {

  return (
    <View style={[styles.container, style]}>

      <RNPickerSelect

        onValueChange={onSelect}
        items={options}
        value={value ?? null}
        placeholder={{ label: placeholder, value: null, color: "#989898" }}
        useNativeAndroidPickerStyle={false} 
        style={{

          inputAndroid: styles.input,
          inputIOS: styles.input,
          placeholder: { color: "#989898" },
          
        }}
    
      />
    </View>
  );
}

const styles = StyleSheet.create({

  container: {

    flexDirection: "column",
    width: 350,
    minHeight: 45,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(17, 16, 17, 0.2)",
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    marginLeft: 12,
    marginBottom: 12,
    zIndex: 100,    
    elevation: 6,   
    marginRight: 15

  },
  input: {

    fontSize: 16,
    color: "#1D1D1D",
    paddingHorizontal: 12,
    fontFamily: "Roboto",
    height: 45,
    justifyContent: "center",

  },
});
