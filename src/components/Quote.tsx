import { FC } from "react";
import { Box } from "@mui/joy";
import TypeWriter from "typewriter-effect";

export const Quote: FC = () => {
  return (
    <Box
      fontWeight="md"
      sx={{
        letterSpacing: "0.1vw",
        sm: { fontSize: "0.5rem" },
        md: { fontSize: "1rem" },
        lg: { fontSize: "1.5rem" },
      }}
      position={"absolute"}
      fontFamily={"Lucia Console, Cursive, monospace"}
      color={"aqua"}
    >
      <TypeWriter
        options={{ loop: true, delay: 160, autoStart: true }}
        onInit={(typewriter) => {
          typewriter
            .typeString(
              "<strong>Never <span style='color:#7b00ff;'>hold yourself back.</span><strong>"
            )
            .pauseFor(1500)
            .deleteAll()
            .typeString("Follow the path, enjoy the journey.")
            .pauseFor(1500)
            .start();
        }}
      />
    </Box>
  );
};
