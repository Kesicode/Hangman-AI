import { View, Text, StyleSheet } from "react-native";
import React from "react";

type HintBoxProps = {
  hintData: string;
};

const HintBox = ({ hintData }: HintBoxProps) => {
  if (!hintData) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.label}>💡 Hint</Text>
      <Text style={styles.hint}>{hintData}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#15803d",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginVertical: 10,
    maxWidth: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    color: "#bbf7d0",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 4,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  hint: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
});

export default HintBox;
