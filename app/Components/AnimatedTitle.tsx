import React from "react";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import "../index.css";
import { Trophy } from "../(dashboard)/trophy/page";

type GetAnimationStyle = (name: string) => React.CSSProperties;

interface AnimatedTitleProps {
  item: Trophy;
}

const getAnimationStyle = (text: string): React.CSSProperties => {
  if (text.length > 37) {
    return { animation: "marquee 10s linear infinite", textAlign: "left" };
  } else {
    return { animation: "none", textAlign: "center" };
  }
};

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ item }) => {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        overflow: "hidden",
      }}
    >
      <Image
        src={`/title_${item.rareType}.webp`}
        alt=""
        width={583}
        height={52}
        style={{ display: "block" }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
          width: "565px",
          overflow: "hidden",
        }}
      >
        <Typography
          fontFamily={"SEGA_KakuGothic-DB"}
          sx={{
            whiteSpace: "nowrap",
            color: "black",
            ...getAnimationStyle(item.name),
          }}
        >
          {item.name}
        </Typography>
      </div>
    </div>
  );
};

export default AnimatedTitle;
