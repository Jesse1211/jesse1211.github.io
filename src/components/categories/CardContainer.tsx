import { Card, Stack } from "@mui/joy";
import { FC, ReactNode } from "react";

export const CardContainer: FC<{
  logoSrc?: string;
  metaDataCardView: ReactNode;
  additionalCardView: ReactNode;
}> = ({ logoSrc, metaDataCardView, additionalCardView }) => {
  return (
    <Card
      size="lg"
      variant="soft"
      sx={{
        width: { xs: 0.8, md: 0.75, lg: 0.6 },
        height: { xs: 0.3, md: 0.45, lg: 0.45 },
        display: "flex",
        flexDirection: { xs: "column", md: "row", lg: "row" },
      }}
      style={{ filter: "opacity(0.9)" }}
    >
      <Stack
        direction={{ xs: "column", md: "column", lg: "row" }}
        width={1}
        display="flex"
        justifyContent="space-around"
        alignItems="center"
      >
        {logoSrc && (
          <img
            src={logoSrc}
            loading="lazy"
            style={{
              width: "50%",
              objectFit: "contain",
            }}
          />
        )}
        {metaDataCardView}
      </Stack>

      {additionalCardView}
    </Card>
  );
};
