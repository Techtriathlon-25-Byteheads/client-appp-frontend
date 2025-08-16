import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View, Image } from "react-native";

const Icon = require("@/assets/images/chatIcon.png");

const TypingIndicator = () => {
  const animations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const loops = animations.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -4,
            duration: 300,
            delay: i * 150,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      )
    );

    loops.forEach((loop) => loop.start());

    return () => {
      loops.forEach((loop) => loop.stop());
    };
  }, [animations]);

  return (
    <View style={styles.row}>
      <Image source={Icon} style={styles.messageAvatar} />
      <View style={[styles.messageBubble, styles.systemBubble]}>
        <View style={styles.dotRow}>
          {animations.map((anim, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  transform: [{ translateY: anim }],
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default TypingIndicator;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: "80%",
  },
  systemBubble: {
    backgroundColor: "#E5E7EB",
  },
  dotRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 20,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: "#9CA3AF",
    borderRadius: 4,
    marginHorizontal: 2,
  },
});