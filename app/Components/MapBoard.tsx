import { useState } from "react";
import { IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { MapReward } from "@/app/(dashboard)/chuni/map/page";
import { getBaseUrl } from "@/app/utils/global";

// Placement measured off the in-game result screen (fractions of the background): one row of equally spaced tiles near the bottom.
// Tiles are shown in pages of 10 (0..9, 10..19, ...); every fifth tile (0 = START, 5) is drawn larger with its number under it.
const TILES = 10;
const FIRST_CENTER = 0.065;
const PITCH = 0.093;
const TILE_WIDTH = 0.08;
const BIG_WIDTH = 0.096;
const ROW_Y = 0.74;

const RewardBadge = ({
  reward,
  left,
  top,
}: {
  reward: MapReward;
  left: number;
  top: number;
}) => (
  <div
    title={reward.name}
    style={{
      position: "absolute",
      left: `${left}%`,
      top: `${top}%`,
      transform: "translate(-50%, -100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      maxWidth: "9%",
      fontSize: "clamp(8px, 1.1vw, 14px)",
      color: "#fff",
      textAlign: "center",
      lineHeight: 1.1,
    }}
  >
    {reward.chara && (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={getBaseUrl(
          "chuni",
          `chara/CHU_UI_Character_${(reward.chara.id / 10).toString().padStart(4, "0")}_00_02.webp`,
        )}
        alt={reward.name}
        style={{ width: "100%", border: "2px solid #ffd800", borderRadius: 4 }}
      />
    )}
    <span
      style={{
        background: "rgba(0,0,0,0.7)",
        borderRadius: 4,
        padding: "1px 4px",
      }}
    >
      {rewardLabel(reward)}
    </span>
  </div>
);

/** Map background with one page of the tile row drawn over it; tiles 0..total, where `total` is the goal. */
const rewardLabel = (reward: MapReward) =>
  reward.gamePoint ? `${reward.gamePoint} pt` : reward.name;

const MapBoard = ({
  background,
  total,
  tileRewards = {},
  goalReward,
  width = 1220,
  height = 680,
}: {
  background: string;
  total: number;
  tileRewards?: { [index: string]: MapReward | null | undefined };
  goalReward?: MapReward | null;
  width?: number;
  height?: number;
}) => {
  const [page, setPage] = useState(0);
  const pages = Math.ceil((total + 1) / TILES);
  const arrow = (side: "left" | "right") => {
    const next = page + (side === "left" ? -1 : 1);
    return (
      <IconButton
        aria-label={side === "left" ? "Previous tiles" : "Next tiles"}
        disabled={next < 0 || next >= pages}
        onClick={() => setPage(next)}
      >
        {side === "left" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
    );
  };
  const sprite = (name: string) => getBaseUrl("chuni", `sprites/${name}.webp`);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        maxWidth: width + 96,
      }}
    >
      {arrow("left")}
      <div
        style={{
          position: "relative",
          flex: 1,
          aspectRatio: `${width} / ${height}`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={background}
          alt=" "
          style={{ width: "100%", height: "100%" }}
        />
        {Array.from(
          { length: Math.min(TILES, total + 1 - page * TILES) },
          (_, slot) => {
            const i = page * TILES + slot;
            const big = i % 5 === 0;
            const w = big ? BIG_WIDTH : TILE_WIDTH;
            const center = FIRST_CENTER + slot * PITCH;
            return (
              <div key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sprite("mapTile")}
                  alt=" "
                  style={{
                    position: "absolute",
                    left: `${(center - w / 2) * 100}%`,
                    top: `${ROW_Y * 100}%`,
                    width: `${w * 100}%`,
                    transform: "translateY(-50%)",
                  }}
                />
                {(i === total ? goalReward : tileRewards[i]) && (
                  <RewardBadge
                    reward={
                      (i === total ? goalReward : tileRewards[i]) as MapReward
                    }
                    left={center * 100}
                    top={(ROW_Y - 0.07) * 100}
                  />
                )}
                {big && i === 0 && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sprite("mapStart")}
                    alt="START"
                    style={{
                      position: "absolute",
                      left: `${center * 100}%`,
                      top: `${(ROW_Y + 0.05) * 100}%`,
                      width: "6%",
                      transform: "translateX(-50%)",
                    }}
                  />
                )}
                {i === total && i % 5 !== 0 && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sprite("mapGoal")}
                    alt="GOAL"
                    style={{
                      position: "absolute",
                      left: `${center * 100}%`,
                      top: `${(ROW_Y + 0.05) * 100}%`,
                      width: "9%",
                      transform: "translateX(-50%)",
                    }}
                  />
                )}
                {big && i > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      left: `${center * 100}%`,
                      top: `${(ROW_Y + 0.05) * 100}%`,
                      transform: "translateX(-50%)",
                      color: "#ffd800",
                      fontWeight: 700,
                      fontSize: "clamp(10px, 1.9vw, 24px)",
                      lineHeight: 1,
                    }}
                  >
                    {i}
                  </div>
                )}
              </div>
            );
          },
        )}
      </div>
      {arrow("right")}
    </div>
  );
};

export default MapBoard;
