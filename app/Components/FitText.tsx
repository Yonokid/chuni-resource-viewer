"use client";
import { Typography, TypographyProps } from "@mui/material";
import { useRef, useState, useEffect } from "react";

interface FitTextProps {
  text?: string;
  variant?: TypographyProps["variant"]; // or 'h1' | 'h2' | ...
  color?: string;
  maxFontSize?: string;
}

const FitText: React.FC<FitTextProps> = ({
  text = "NONE",
  variant = "h4",
  color = "textPrimary",
  maxFontSize = "1rem",
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const resizeText = () => {
      if (textRef.current) {
        const parentElement = textRef.current.parentElement;
        if (parentElement) {
          const parentWidth = textRef.current.parentElement.clientWidth;
          const textWidth = textRef.current.scrollWidth;

          if (textWidth > parentWidth) {
            setScale(parentWidth / textWidth);
          } else {
            setScale(1); // Reset scale if text fits
          }
        }
      }
    };

    resizeText();
    window.addEventListener("resize", resizeText);

    return () => {
      window.removeEventListener("resize", resizeText);
    };
  }, [text]);

  return (
    <Typography
      variant={variant}
      color={color}
      ref={textRef}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "left top",
        whiteSpace: "nowrap",
        fontSize: maxFontSize, // Apply max font size
        marginBottom: "5px",
      }}
    >
      {text}
    </Typography>
  );
};
export default FitText;
