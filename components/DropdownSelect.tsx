import React from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface Option {
  label: string;
  value: string;
}

interface DropdownSelectProps {
  options: Option[];
  value: string | null;
  onSelect: (value: string) => void;
  placeholder?: string;
}

export function DropdownSelect({
  options,
  value,
  onSelect,
  placeholder = "Selecione uma opção",
}: DropdownSelectProps) {
  return (
    <View style={styles.container}>
      <Dropdown
        data={options}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        onChange={(item) => onSelect(item.value)}
        style={styles.dropdown}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        itemTextStyle={styles.itemText}
        iconStyle={styles.icon}
        containerStyle={styles.dropdownContainer}
        activeColor="#f0f0f0"
        renderRightIcon={() => null} // remove ícone padrão
        dropdownPosition="top" // abre pra baixo
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  dropdown: {
    height: 45,
    borderColor: "rgba(17, 16, 17, 0.2)",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
  },
  placeholder: {
    color: "#989898",
    fontSize: 16,
  },
  selectedText: {
    color: "#1D1D1D",
    fontSize: 16,
  },
  itemText: {
    fontSize: 16,
    color: "#1D1D1D",
  },
  dropdownContainer: {
    borderRadius: 12,
    borderColor: "#ccc",
  },
  icon: {
    width: 20,
    height: 20,
  },
});
