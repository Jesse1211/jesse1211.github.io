import { FC } from "react";
import Typewriter from "typewriter-effect";

export const TypeLine: FC<{
  text: string;
  delay?: number;
  onDone?: () => void;
}> = ({ text, delay = 35, onDone }) => (
  <Typewriter
    key={text}
    options={{ delay, cursor: "" }}
    onInit={(tw) => {
      tw.typeString(text)
        .callFunction(() => {
          onDone?.();
        })
        .start();
    }}
  />
);
