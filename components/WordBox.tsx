// WordBox.tsx
import { View, Text, useWindowDimensions } from "react-native";
import React, { useMemo } from "react";

type WordBoxType = {
  correctWord: string;
  correctLetters: string[];
  gameOver?: boolean;
};

const WordBox = ({ correctWord, correctLetters, gameOver = false }: WordBoxType) => {
  const { width: screenWidth } = useWindowDimensions();

  const PADDING_HORIZONTAL = 48;
  const MIN_BOX_SIZE = 30;
  const MIN_FONT_SIZE = 14;
  const LETTER_MARGIN = 4;

  const letterBoxProperties = useMemo(() => {
    const wordLength = correctWord.length;
    const availableWidth = screenWidth - PADDING_HORIZONTAL;

    if (wordLength === 0) {
      return { width: MIN_BOX_SIZE, height: MIN_BOX_SIZE, fontSize: MIN_FONT_SIZE, margin: LETTER_MARGIN };
    }

    const totalMarginSpace = (wordLength - 1) * LETTER_MARGIN * 2;
    const calculatedBoxWidth = (availableWidth - totalMarginSpace) / wordLength;
    const size = Math.max(Math.min(calculatedBoxWidth, 52), MIN_BOX_SIZE);

    return {
      width: size,
      height: size,
      fontSize: Math.max(size * 0.48, MIN_FONT_SIZE),
      margin: LETTER_MARGIN,
    };
  }, [correctWord, screenWidth]);

  if (correctWord.length === 0) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ color: "#6B7280", fontSize: 16 }}>Loading word…</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        paddingHorizontal: 8,
        paddingVertical: 16,
      }}
    >
      {correctWord.split("").map((letter, index) => {
        const isRevealed = correctLetters.includes(letter) || gameOver;
        return (
          <View
            key={index}
            style={{
              width: letterBoxProperties.width,
              height: letterBoxProperties.height,
              margin: letterBoxProperties.margin,
              backgroundColor: isRevealed
                ? gameOver && !correctLetters.includes(letter)
                  ? "#991b1b" // red-800: missed letter on game over
                  : "#15803d" // green-700: correct guess
                : "#374151", // gray-700: unguessed
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              borderBottomWidth: 3,
              borderBottomColor: isRevealed ? "transparent" : "#9CA3AF",
            }}
          >
            <Text
              style={{
                fontSize: letterBoxProperties.fontSize,
                fontWeight: "900",
                color: "white",
                textAlign: "center",
              }}
            >
              {isRevealed ? letter : ""}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default WordBox;