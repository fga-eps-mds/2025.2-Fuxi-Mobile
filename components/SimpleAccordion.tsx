import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/theme/colors";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export function SimpleAccordion({ title, children, style }: any) {
  const [open, setOpen] = useState(false);

  function toggleAccordion() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.header} onPress={toggleAccordion}>
        <Text style={styles.title}>{title}</Text>

        <Ionicons 
          name={open ? "chevron-up-outline" : "chevron-down-outline"}
          size={22}
          color="#444"
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.content}>
          <Text style={styles.text}>{children}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F8FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(152, 152, 152, 0.10)",
    // marginBottom: 12,
    overflow: "hidden"
  },
  header: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "600"
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  text: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
});
