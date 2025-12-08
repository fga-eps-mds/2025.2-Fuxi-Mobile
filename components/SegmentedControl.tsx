import * as React from "react";
import { Text, View, StyleSheet, TextProps, TouchableOpacity } from "react-native";
import colors from "@/theme/colors";

const SegmentedControl = ({ options, selected, onSelect }) => {
  return (
    <View style={styles.container}>
      {options.map((option, index) => {
        const isSelected = selected === option;
        return (
          <TouchableOpacity
            key={index}
            style={[styles.button, isSelected && styles.selectedButton]}
            onPress={() => onSelect(option)}
          >
            <Text style={[styles.text, isSelected && styles.selectedText]}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    gap: 4
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#efefef',
  },
  selectedButton: {
    backgroundColor: '#E6F4FE',
  },
  text: {
    color: '#1D1D1D',
    fontWeight: '500',
  },
  selectedText: {
    color: '#003A7A',
  },
});

export default SegmentedControl;
