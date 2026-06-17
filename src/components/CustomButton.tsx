import Button from "@mui/material/Button";

interface CustomButtonProps {
    text: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
}

const CustomButton = ({
    text,
    onClick,
    type = "button",
}: CustomButtonProps) => {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            type={type}
            fullWidth
        >
            {text}
        </Button>
    );
};

export default CustomButton;