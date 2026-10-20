import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";

type KeyType = {
  text: string;
  onPressFn: (text: string) => void;
  disabled: boolean;
  guessedCorrect: boolean;
  guessedWrong: boolean;
};

type KeyboardLayoutType = {
  onPressFn: (text: string) => void;
  correctLetters: string[];
  wrongLetters: string[];
};

const Key = ({ text, onPressFn, disabled, guessedCorrect, guessedWrong }: KeyType) => {
  let bg = "#6B7280"; // gray-500 default
  if (guessedCorrect) bg = "#16a34a"; // green-600
  if (guessedWrong) bg = "#dc2626";   // red-600

  return (
    <TouchableOpacity
      onPress={() => !disabled && onPressFn(text)}
      disabled={disabled}
      style={[
        styles.key,
        { backgroundColor: bg, opacity: disabled ? 0.5 : 1 },
      ]}
    >
      <Text style={styles.keyText}>{text}</Text>
    </TouchableOpacity>
  );
};

const KeyboardLayout = ({ onPressFn, correctLetters, wrongLetters }: KeyboardLayoutType) => {
  const qwertyRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  return (
    <View style={styles.keyboard}>
      {qwertyRows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => {
            const isCorrect = correctLetters.includes(key);
            const isWrong = wrongLetters.includes(key);
            return (
              <Key
                key={key}
                text={key}
                onPressFn={onPressFn}
                disabled={isCorrect || isWrong}
                guessedCorrect={isCorrect}
                guessedWrong={isWrong}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  keyboard: {
    flexDirection: "column",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 6,
  },
  key: {
    width: 32,
    height: 40,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    margin: 3,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  keyText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
  },
});

export default KeyboardLayout;
