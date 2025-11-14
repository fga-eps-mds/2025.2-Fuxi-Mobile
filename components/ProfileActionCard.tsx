import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { AppText } from "@/components/AppText";
import { Feather } from "@expo/vector-icons";

interface ProfileActionCardProps {
  title: string;
  description?: string;
  onPress: () => void;
}

export function ProfileActionCard({
  title,
  description,
  onPress,
}: ProfileActionCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.textContainer}>
        <AppText style={styles.title}>{title}</AppText>
        {description && (
          <AppText style={styles.description}>{description}</AppText>
        )}
      </View>

      <Feather name="chevron-right" size={22} color="#003A7A" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    padding: 18,
    marginTop: 20,

    backgroundColor: "#F5F8FF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(152,152,152,0.10)",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  textContainer: {
    flexDirection: "column",
    flexShrink: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#003A7A",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});
