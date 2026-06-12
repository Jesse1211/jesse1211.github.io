import { FC, useState } from "react";
import { Box, Stack } from "@mui/joy";
import WechatDialog from "./WechatDialog";

interface Row {
  tag: string;
  display: string;
  href?: string;
  onClick?: () => void;
}

const rowSx = {
  display: "inline-grid",
  gridTemplateColumns: "3em 1fr",
  gap: 1,
  alignItems: "baseline",
  background: "none",
  border: 0,
  p: "4px 6px",
  color: "inherit",
  font: "inherit",
  textDecoration: "none",
  cursor: "pointer",
  borderRadius: 0.5,
  transition: "background-color .12s, color .12s",
  "&:hover": {
    background: "hsla(180,100%,70%,0.08)",
    color: "hsla(180,100%,80%,1)",
  },
  "&:focus-visible": {
    outline: "none",
    boxShadow: "0 0 0 2px hsla(180,100%,70%,0.6)",
  },
} as const;

const SocialMediaButtons: FC = () => {
  const [wechatOpen, setWechatOpen] = useState(false);
  const rows: Row[] = [
    {
      tag: "@",
      display: "mailto:zl942@cornell.edu",
      href: "mailto:zl942@cornell.edu",
    },
    {
      tag: "gh",
      display: "github.com/Jesse1211",
      href: "https://www.github.com/Jesse1211",
    },
    {
      tag: "in",
      display: "linkedin.com/in/jesse-liu-0613201b4",
      href: "https://www.linkedin.com/in/jesse-liu-0613201b4/",
    },
    {
      tag: "ig",
      display: "instagram.com/zhl_lzh",
      href: "https://www.instagram.com/zhl_lzh/",
    },
    {
      tag: "wx",
      display: "wechat (qr) →",
      onClick: () => setWechatOpen(true),
    },
  ];
  return (
    <>
      <Stack spacing={0.4}>
        {rows.map((r) =>
          r.href ? (
            <Box
              key={r.tag}
              component="a"
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              sx={rowSx}
            >
              <Box className="term-accent">[{r.tag}]</Box>
              <Box>{r.display}</Box>
            </Box>
          ) : (
            <Box
              key={r.tag}
              component="button"
              type="button"
              onClick={r.onClick}
              sx={rowSx}
            >
              <Box className="term-accent">[{r.tag}]</Box>
              <Box>{r.display}</Box>
            </Box>
          ),
        )}
      </Stack>
      <WechatDialog open={wechatOpen} onClose={() => setWechatOpen(false)} />
    </>
  );
};

export default SocialMediaButtons;
