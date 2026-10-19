import React from "react";
import Typography from "@mui/material/Typography";
import { spriteUrl } from "@/app/utils/enums";
import "../index.css";
import { Trophy } from "../(dashboard)/chuni/trophy/page";

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
        maxWidth: "100%",
      }}
    >
      <img
        src={spriteUrl("trophyRank", item.rareType)}
        alt=""
        width={583}
        style={{ display: "block", height: "auto", maxWidth: "100%" }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
          width: "calc(100% - 18px)",
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
