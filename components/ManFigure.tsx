import { View } from "react-native";
import React from "react";
import Svg, { Ellipse, Line, Rect } from "react-native-svg";
import { createAnimatableComponent } from "react-native-animatable";
import { useColorScheme } from "nativewind";

type ManFigureProps = {
  wrongWord: number;
};

const AnimatableLine = createAnimatableComponent(Line);
const AnimatableRect = createAnimatableComponent(Rect);
const AnimatableEllipse = createAnimatableComponent(Ellipse);

// Hangman parts revealed per wrong guess:
// wrongWord >= 1 → Rope
// wrongWord >= 2 → Head
// wrongWord >= 3 → Body (neck/torso merged into one rect for accuracy)
// wrongWord >= 4 → Left Arm
// wrongWord >= 5 → Right Arm
// wrongWord >= 6 → Left Leg
// wrongWord >= 7 → Right Leg
// wrongWord >= 8 → GAME OVER (all 7 body parts shown)

const ManFigure = ({ wrongWord }: ManFigureProps) => {
  const theme = useColorScheme();
  const shapeColor = theme.colorScheme !== "dark" ? "#1e293b" : "#f1f5f9";
  const gallowsColor = theme.colorScheme !== "dark" ? "#78350f" : "#d97706";

  // ---- Gallows (always visible) ----
  const Base = (
    <Rect fill={gallowsColor} width="340" height="14" x="5" y="376" rx="4" />
  );
  const SideBar = (
    <Rect fill={gallowsColor} width="14" height="370" x="25" y="10" rx="4" />
  );
  const TopBar = (
    <Rect fill={gallowsColor} width="180" height="14" x="25" y="10" rx="4" />
  );
  const RopePost = (
    <Rect fill={gallowsColor} width="8" height="20" x="197" y="10" rx="3" />
  );

  // ---- Body parts (animated) ----
  const Rope = (
    <AnimatableLine
      animation="fadeIn"
      duration={400}
      x1="201"
      y1="30"
      x2="201"
      y2="80"
      stroke={shapeColor}
      strokeWidth="6"
      strokeLinecap="round"
    />
  );

  const Head = (
    <AnimatableEllipse
      animation="fadeIn"
      duration={400}
      cx="201"
      cy="110"
      rx="30"
      ry="30"
      stroke={shapeColor}
      strokeWidth="6"
      fill="none"
    />
  );

  // Torso (replaces old Neck + Body — merged to prevent gap artifact)
  const Torso = (
    <AnimatableLine
      animation="fadeIn"
      duration={400}
      x1="201"
      y1="140"
      x2="201"
      y2="230"
      stroke={shapeColor}
      strokeWidth="6"
      strokeLinecap="round"
    />
  );

  const ArmLeft = (
    <AnimatableLine
      animation="fadeIn"
      duration={400}
      x1="201"
      y1="165"
      x2="155"
      y2="210"
      stroke={shapeColor}
      strokeLinecap="round"
      strokeWidth="6"
    />
  );

  const ArmRight = (
    <AnimatableLine
      animation="fadeIn"
      duration={400}
      x1="201"
      y1="165"
      x2="247"
      y2="210"
      stroke={shapeColor}
      strokeLinecap="round"
      strokeWidth="6"
    />
  );

  const LegLeft = (
    <AnimatableLine
      animation="fadeIn"
      duration={400}
      x1="201"
      y1="230"
      x2="155"
      y2="290"
      stroke={shapeColor}
      strokeLinecap="round"
      strokeWidth="6"
    />
  );

  const LegRight = (
    <AnimatableLine
      animation="fadeIn"
      duration={400}
      x1="201"
      y1="230"
      x2="247"
      y2="290"
      stroke={shapeColor}
      strokeLinecap="round"
      strokeWidth="6"
    />
  );

  return (
    <View>
      <Svg
        viewBox="0 0 350 400"
        preserveAspectRatio="xMidYMid meet"
        width="240"
        height="240"
      >
        {Base}
        {SideBar}
        {TopBar}
        {RopePost}
        {wrongWord >= 1 && Rope}
        {wrongWord >= 2 && Head}
        {wrongWord >= 3 && Torso}
        {wrongWord >= 4 && ArmLeft}
        {wrongWord >= 5 && ArmRight}
        {wrongWord >= 6 && LegLeft}
        {wrongWord >= 7 && LegRight}
      </Svg>
    </View>
  );
};

export default ManFigure;
