import { FC, useEffect, useRef } from "react";
import Typewriter from "typewriter-effect";

export const TypeLine: FC<{
  text: string;
  delay?: number;
  onDone?: () => void;
}> = ({ text, delay = 35, onDone }) => {
  const doneRef = useRef(false);
  useEffect(() => {
    doneRef.current = false;
  }, [text]);
  return (
    <Typewriter
      key={text}
      options={{ delay, cursor: "" }}
      onInit={(tw) => {
        tw.typeString(text)
          .callFunction(() => {
            if (!doneRef.current) {
              doneRef.current = true;
              onDone?.();
            }
          })
          .start();
      }}
    />
  );
};
