import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CustomModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactNode;
}

const CustomModal = ({
    open,
    onClose,
    title,
    children,
}: CustomModalProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                {title}

                <IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 10,
                        top: 10,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    );
};

export default CustomModal;