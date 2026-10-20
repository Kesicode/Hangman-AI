import HintBox from "@/components/HintBox";
import KeyboardLayout from "@/components/KeyboardLayout";
import ManFigure from "@/components/ManFigure";
import WordBox from "@/components/WordBox";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  Animated,
  Easing,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";

const MAX_WRONG = 7; // 7 body parts → game over on 8th wrong

export default function Index() {
  const [correctWord, setCorrectWord] = useState("");
  const [hint, setHint] = useState("");
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [wrongCount, setWrongCount] = useState(0);
  const [status, setStatus] = useState<"loading" | "playing" | "completed" | "gameOver">("loading");
  const [modalVisible, setModalVisible] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  // ─── Start / reset game ────────────────────────────────────────────────────
  const startGame = useCallback(async () => {
    setStatus("loading");
    setCorrectLetters([]);
    setWrongLetters([]);
    setWrongCount(0);
    setModalVisible(false);
    animatedValue.setValue(0);
    setCorrectWord("");
    setHint("");

    try {
      const response = await fetch("http://localhost:5000/gameData");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (!data.word || data.word === "ERROR") {
        throw new Error("Invalid word from server");
      }

      setCorrectWord(data.word.toUpperCase());
      setHint(data.hint);
      setStatus("playing");

      Toast.show({
        type: "success",
        text1: "New Game Started! 🎮",
        text2: "Guess the word! Good luck!",
        visibilityTime: 2500,
      });
    } catch (error) {
      console.error("Error fetching game data:", error);
      setStatus("playing");
      // Fallback word so the game still works if server is slow
      const fallbacks = ["PYTHON", "GUITAR", "PLANET", "BRIDGE", "CASTLE"];
      const word = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      setCorrectWord(word);
      setHint("Could not reach server — using a fallback word.");
      Toast.show({
        type: "error",
        text1: "Server unavailable",
        text2: "Playing with a fallback word.",
        visibilityTime: 3000,
      });
    }
  }, [animatedValue]);

  // Initial load
  useEffect(() => {
    startGame();
  }, []);

  // ─── Modal animation on status change ──────────────────────────────────────
  useEffect(() => {
    if (status === "gameOver" || status === "completed") {
      setModalVisible(true);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.back(1.3)),
        useNativeDriver: true,
      }).start();
    }
  }, [status, animatedValue]);

  // ─── Win check ─────────────────────────────────────────────────────────────
  const checkWin = useCallback(
    (letters: string[]) => {
      const uniqueLetters = [...new Set(correctWord.split(""))];
      if (uniqueLetters.every((l) => letters.includes(l))) {
        setStatus("completed");
        Toast.show({
          type: "success",
          text1: "🎉 Congratulations!",
          text2: `You guessed: ${correctWord}`,
          visibilityTime: 3500,
          topOffset: 80,
        });
      }
    },
    [correctWord]
  );

  // ─── Handle key press ──────────────────────────────────────────────────────
  const handleLetterPress = useCallback(
    (input: string) => {
      if (status !== "playing") return;

      const letter = input.toUpperCase();

      // Ignore already-guessed letters (keyboard is disabled anyway, belt & suspenders)
      if (correctLetters.includes(letter) || wrongLetters.includes(letter)) return;

      if (correctWord.includes(letter)) {
        const updated = [...correctLetters, letter];
        setCorrectLetters(updated);
        checkWin(updated);
      } else {
        const newWrongCount = wrongCount + 1;
        setWrongLetters((prev) => [...prev, letter]);
        setWrongCount(newWrongCount);

        if (newWrongCount >= MAX_WRONG + 1) {
          // wrongCount maxes at MAX_WRONG+1 = 8 → all body parts shown
          setStatus("gameOver");
          Toast.show({
            type: "error",
            text1: "💀 Game Over!",
            text2: `The word was: ${correctWord}`,
            visibilityTime: 4000,
            topOffset: 80,
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Wrong guess!",
            text2: `'${letter}' is not in the word. ${MAX_WRONG + 1 - newWrongCount} chances left.`,
            visibilityTime: 1800,
          });
        }
      }
    },
    [status, correctLetters, wrongLetters, correctWord, wrongCount, checkWin]
  );

  // ─── Animated modal style ──────────────────────────────────────────────────
  const modalAnimStyle = {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.6, 1],
        }),
      },
    ],
    opacity: animatedValue,
  };

  // ─── Wrong count display ───────────────────────────────────────────────────
  const chancesLeft = Math.max(MAX_WRONG + 1 - wrongCount, 0);

  return (
    <View style={styles.screen}>
      {/* ── Hangman figure ── */}
      <View style={styles.figureArea}>
        <ManFigure wrongWord={wrongCount} />

        {/* Wrong count badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            ❌ {wrongCount} / {MAX_WRONG + 1}
          </Text>
        </View>
      </View>

      {/* ── Hint ── */}
      <HintBox hintData={hint} />

      {/* ── Word boxes ── */}
      {status === "loading" ? (
        <View style={styles.loadingArea}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Getting word from AI…</Text>
        </View>
      ) : (
        <WordBox
          correctWord={correctWord}
          correctLetters={correctLetters}
          gameOver={status === "gameOver"}
        />
      )}

      {/* ── Keyboard ── */}
      <View style={styles.keyboardArea}>
        <KeyboardLayout
          onPressFn={handleLetterPress}
          correctLetters={correctLetters}
          wrongLetters={wrongLetters}
        />
      </View>

      {/* ── Game Over / Win Modal ── */}
      <Modal
        animationType="none"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalCard, modalAnimStyle]}>
            {status === "gameOver" ? (
              <>
                <Text style={styles.modalEmoji}>💀</Text>
                <Text style={[styles.modalTitle, { color: "#dc2626" }]}>
                  GAME OVER!
                </Text>
                <Text style={styles.modalSub}>The word was:</Text>
                <Text style={styles.modalWord}>{correctWord}</Text>
              </>
            ) : (
              <>
                <Text style={styles.modalEmoji}>🎉</Text>
                <Text style={[styles.modalTitle, { color: "#16a34a" }]}>
                  YOU WON!
                </Text>
                <Text style={styles.modalSub}>The word was:</Text>
                <Text style={styles.modalWord}>{correctWord}</Text>
              </>
            )}
            <TouchableOpacity onPress={startGame} style={styles.playAgainBtn}>
              <Text style={styles.playAgainText}>Play Again 🎮</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      <Toast position="top" topOffset={60} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  figureArea: {
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#fef2f2",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  badgeText: {
    color: "#dc2626",
    fontWeight: "700",
    fontSize: 14,
  },
  loadingArea: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 10,
  },
  loadingText: {
    color: "#6b7280",
    fontSize: 15,
    marginTop: 8,
  },
  keyboardArea: {
    width: "100%",
    paddingBottom: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  modalCard: {
    backgroundColor: "white",
    padding: 32,
    borderRadius: 20,
    width: "82%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  modalEmoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 12,
    letterSpacing: 1,
  },
  modalSub: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 4,
  },
  modalWord: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1e40af",
    marginBottom: 24,
    letterSpacing: 3,
  },
  playAgainBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 50,
    elevation: 3,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  playAgainText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
});
