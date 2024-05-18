import { Icon } from "@iconify/react";
import { Email, GitHub, Instagram, LinkedIn } from "@mui/icons-material";
import { ButtonGroup, IconButton, Link } from "@mui/joy";
import { useState } from "react";
import WechatDialog from "./WechatDialog";

const SocialMediaButtons = () => {
  const [wechatDialogOpen, setWechatDialogOpen] = useState(false);
  return (
    <ButtonGroup
      spacing={3}
      sx={{ margin:"15px", flexWrap: "wrap"}}
    >
      <IconButton
        component={Link}
        variant="solid"
        size="md"
        href="mailto:zl942@cornell.edu"
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
      >
        <Email />
      </IconButton>
      <IconButton
        component={Link}
        color="primary"
        size="md"
        href="https://www.github.com/Jesse1211"
        target="_blank"
        variant="solid"
      >
        <GitHub />
      </IconButton>
      <IconButton
        component={Link}
        variant="solid"
        color="primary"
        size="md"
        href="https://www.linkedin.com/in/jesse-liu-0613201b4/"
        target="_blank"
      >
        <LinkedIn />
      </IconButton>
      <IconButton
        component={Link}
        color="primary"
        variant="solid"
        size="md"
        href="https://www.instagram.com/zhl_lzh/"
        target="_blank"
      >
        <Instagram />
      </IconButton>
      <IconButton
        variant="solid"
        color="primary"
        size="md"
        onClick={() => setWechatDialogOpen(true)}
      >
        <Icon icon="mdi:wechat" height={24} width={24} />
      </IconButton>
      <WechatDialog
        open={wechatDialogOpen}
        onClose={() => setWechatDialogOpen(false)}
      />
    </ButtonGroup>
  );
};

export default SocialMediaButtons;
