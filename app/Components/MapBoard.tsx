import React, { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Link from "next/link";
import MapBonusList from "@/app/Components/MapBonusList";
import type { AssetRef } from "@/app/Components/AssetLink";
import type { MapBonus, MapReward } from "@/app/(dashboard)/chuni/map/page";
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
      // percentage-width images collapse to 0 in a shrink-to-fit box, so image badges get a fixed width; text badges size to content (tiles right of the board would otherwise wrap one letter per line)
      ...(reward.icon || reward.chara
        ? { width: "9%" }
        : { width: "max-content", maxWidth: "9%" }),
      fontSize: "clamp(8px, 1.1vw, 14px)",
      color: "#fff",
      textAlign: "center",
      lineHeight: 1.1,
    }}
  >
    {reward.icon && (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={getBaseUrl("chuni", reward.icon)}
        alt={reward.name}
        style={{ width: "100%" }}
      />
    )}
    {reward.chara && (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={getBaseUrl(
          "chuni",
          `chara/CHU_UI_Character_${(reward.chara.id / 10).toString().padStart(4, "0")}_00_02.webp`,
        )}
        alt={reward.name}
        style={{
          width: "100%",
          border: "2px solid #ffd800",
          background: "linear-gradient(#2b3a67, #121a33)",
          borderRadius: 4,
        }}
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
  challengeSong,
  bonus,
  width = 1220,
  height = 680,
}: {
  background: string;
  total: number;
  tileRewards?: { [index: string]: MapReward | null | undefined };
  goalReward?: MapReward | null;
  challengeSong?: AssetRef | null;
  bonus?: MapBonus | null;
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
  const jump = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const index = Math.round(((e.clientX - rect.left) / rect.width) * total);
    setPage(Math.min(Math.max(Math.floor(index / TILES), 0), pages - 1));
  };
  const at = (index: number) => `${(index / Math.max(total, 1)) * 100}%`;
  return (
    <div style={{ maxWidth: width + 96 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
          {/* the track slides by one page per step; only pages around the current one are rendered */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: `translateX(${-page * TILES * PITCH * 100}%)`,
                transition: "transform 0.5s ease",
              }}
            >
              {Array.from(
                {
                  length:
                    Math.min(total, (page + 2) * TILES - 1) -
                    Math.max(0, (page - 1) * TILES) +
                    1,
                },
                (_, slot) => {
                  const i = Math.max(0, (page - 1) * TILES) + slot;
                  const big = i % 5 === 0;
                  const w = big ? BIG_WIDTH : TILE_WIDTH;
                  const center = FIRST_CENTER + i * PITCH;
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
                            (i === total
                              ? goalReward
                              : tileRewards[i]) as MapReward
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
          </div>
          {challengeSong && (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                padding: "0.6% 2%",
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.85), rgba(0,0,0,0.5))",
                color: "#fff",
                fontSize: "clamp(10px, 1.5vw, 18px)",
              }}
            >
              課題曲：
              <Link
                href={`/chuni/music/${challengeSong.id}`}
                style={{ color: "#fff" }}
              >
                {challengeSong.name}
              </Link>
            </div>
          )}
          {bonus && bonus.substances.length > 0 && (
            <Tooltip
              title={<MapBonusList substances={bonus.substances} />}
              placement="bottom-end"
              arrow
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getBaseUrl("chuni", "sprites/mapBonus.webp")}
                alt="Map bonus"
                style={{
                  position: "absolute",
                  top: "3%",
                  right: "2%",
                  width: "8%",
                  cursor: "help",
                }}
              />
            </Tooltip>
          )}
        </div>
        {arrow("right")}
      </div>
      {/* timeline of the whole area: reward tiles, the goal and the visible page; click to jump */}
      <div style={{ margin: "12px 48px 0" }}>
        <div
          onClick={jump}
          role="button"
          aria-label="Jump to tiles"
          style={{
            position: "relative",
            height: 14,
            borderRadius: 7,
            background: "rgba(128,128,128,0.35)",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              // clamp to the bar: the last page can hold fewer than TILES tiles, and a tiny window keeps a 6px minimum
              left: `min(${at(page * TILES)}, calc(100% - 6px))`,
              width: `max(${at(Math.min(TILES, total - page * TILES))}, 6px)`,
              borderRadius: 7,
              background: "rgba(255,216,0,0.55)",
              border: "1px solid #ffd800",
              boxSizing: "border-box",
              transition: "left 0.5s ease",
            }}
          />
          {Object.entries(tileRewards).map(
            ([index, reward]) =>
              reward && (
                <div
                  key={index}
                  title={`${index}: ${reward.name}`}
                  style={{
                    position: "absolute",
                    top: reward.gamePoint ? 5 : 2,
                    left: at(Number(index)),
                    width: reward.gamePoint ? 4 : 8,
                    height: reward.gamePoint ? 4 : 10,
                    borderRadius: "50%",
                    background: reward.gamePoint ? "#ffd800" : "#ff4fa0",
                    transform: "translateX(-50%)",
                    pointerEvents: "none",
                  }}
                />
              ),
          )}
          {goalReward && (
            <div
              title={`${total}: ${goalReward.name}`}
              style={{
                position: "absolute",
                top: -2,
                left: "100%",
                width: 4,
                height: 18,
                background: "#e53935",
                transform: "translateX(-50%)",
                pointerEvents: "none",
              }}
            />
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            opacity: 0.7,
          }}
        >
          <span>0</span>
          <span>
            Tiles {page * TILES}–{Math.min(page * TILES + TILES - 1, total)}
          </span>
          <span>{total}</span>
        </div>
      </div>
    </div>
  );
};

export default MapBoard;
