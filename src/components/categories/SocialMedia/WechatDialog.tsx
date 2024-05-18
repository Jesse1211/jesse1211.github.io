import { AspectRatio, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy"

interface WechatModalProps {
    open: boolean
    onClose: () => void
}

const WechatDialog = (props: WechatModalProps) => {
    const { open, onClose } = props

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog
                variant="plain"
                sx={{ gap: "1rem" }}
            >
                <ModalClose />
                <Typography level="title-lg" textColor="inherit">
                    SCAN TO ADD ME
                </Typography>
                <AspectRatio
                    ratio={3 / 4}
                    variant="plain"
                    sx={() => ({
                        minWidth: "240px",
                        borderRadius: 20,
                    })}
                >
                    <img src={`Wechat.jpg`} alt="Wechat QR Code" />
                </AspectRatio>
            </ModalDialog>
        </Modal>
    )
}

export default WechatDialog
