import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useColorScheme } from "nativewind";

const Header = () => {
  const theme = useColorScheme();
  const isDark = theme.colorScheme === "dark";

  return (
    <View style={[styles.header, { backgroundColor: isDark ? "#1c1c1e" : "#dda15e" }]}>
      <Text style={[styles.title, { color: isDark ? "#fff" : "#1c1c1e" }]}>
        🎯 Hangman AI
      </Text>
      <TouchableOpacity
        onPress={() => theme.toggleColorScheme()}
        style={styles.themeButton}
        accessibilityLabel="Toggle dark/light mode"
      >
        <Text style={styles.themeIcon}>{isDark ? "☀️" : "🌙"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  themeButton: {
    padding: 4,
  },
  themeIcon: {
    fontSize: 24,
  },
});

export default Header;
