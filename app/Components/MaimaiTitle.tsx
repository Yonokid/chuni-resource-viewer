import React from "react";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import "../index.css";
import { Title } from "../(dashboard)/maimai/title/page";

type GetAnimationStyle = (name: string) => React.CSSProperties;

interface maimaiTitleProps {
  item: Title;
}

const getAnimationStyle = (text: string): React.CSSProperties => {
  if (text.length > 37) {
    return { animation: "marquee 10s linear infinite", textAlign: "left" };
  } else {
    return { animation: "none", textAlign: "center" };
  }
};

const MaimaiTitle: React.FC<maimaiTitleProps> = ({ item }) => {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        overflow: "hidden",
      }}
    >
      <Image
        src={`/maimai/title_${item.rareType}.webp`}
        alt=""
        width={268}
        height={25}
        style={{ display: "block" }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
          width: "248px",
          overflow: "hidden",
        }}
      >
        <Typography
          fontFamily={"sans-serif"}
          sx={{
            whiteSpace: "nowrap",
            color: "white",
            fontSize: "15px",
            WebkitTextStroke: "2px black",
            paintOrder: "stroke fill",
            ...getAnimationStyle(item.name),
          }}
        >
          {item.name}
        </Typography>
      </div>
    </div>
  );
};

export default MaimaiTitle;
