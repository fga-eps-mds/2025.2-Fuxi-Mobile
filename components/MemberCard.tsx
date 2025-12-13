import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { AppText } from "@/components/AppText";
import colors from "@/theme/colors";

interface MemberCardProps {
  name: string;
  email: string;
}

export function MemberCard({
  name,
  email,
}: MemberCardProps) {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.textContainer}>
        <AppText style={styles.title}>{name}</AppText>
        <AppText style={styles.description}>{email}</AppText>
      </View>
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
  },
  textContainer: {
    flexDirection: "column",
    flexShrink: 1,
  },
  title: {
    fontSize: 17,
    color: "#1E1E1E",
  },
  description: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 2,
  },
});
