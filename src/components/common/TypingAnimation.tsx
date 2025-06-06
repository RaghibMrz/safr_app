// src/components/common/TypingAnimation.tsx
import React, { useEffect, useState, useRef } from "react";
import { Text, TextStyle } from "react-native";

interface TypingAnimationProps {
  words: string[];
  style?: TextStyle;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  shuffle?: boolean;
}

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const TypingAnimation: React.FC<TypingAnimationProps> = ({
  words,
  style,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
  shuffle = false,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [shuffledWords, setShuffledWords] = useState(words);

  const charIndexRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  // Shuffle words on mount and when we complete a cycle
  useEffect(() => {
    if (shuffle) {
      setShuffledWords(shuffleArray(words));
    } else {
      setShuffledWords(words);
    }
  }, [words, shuffle]);

  useEffect(() => {
    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    const currentWord = shuffledWords[wordIndex];

    const type = () => {
      if (!isDeleting) {
        // Typing
        if (charIndexRef.current < currentWord.length) {
          setDisplayText(currentWord.substring(0, charIndexRef.current + 1));
          charIndexRef.current++;
          timeoutRef.current = setTimeout(type, typingSpeed);
        } else {
          // Finished typing, pause then start deleting
          timeoutRef.current = setTimeout(() => {
            setIsDeleting(true);
            type();
          }, pauseDuration);
        }
      } else {
        // Deleting
        if (charIndexRef.current > 0) {
          setDisplayText(currentWord.substring(0, charIndexRef.current - 1));
          charIndexRef.current--;
          timeoutRef.current = setTimeout(type, deletingSpeed);
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false);
          const nextIndex = (wordIndex + 1) % shuffledWords.length;
          setWordIndex(nextIndex);

          // Reshuffle when we complete a cycle
          if (shuffle && nextIndex === 0) {
            setShuffledWords(shuffleArray(words));
          }
        }
      }
    };

    type();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    wordIndex,
    isDeleting,
    shuffledWords,
    words,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    shuffle,
  ]);

  return (
    <Text style={style}>
      {displayText}
      <Text style={{ opacity: showCursor ? 1 : 0 }}>|</Text>
    </Text>
  );
};
