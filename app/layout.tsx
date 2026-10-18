"use client";
import React, { useState, useEffect } from "react";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import {
  Home as HomeIcon,
  Album as AlbumIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  Person2 as Person2Icon,
  Movie as MovieIcon,
  Event as EventIcon,
  Map as MapIcon,
  AutoAwesome as AutoAwesomeIcon,
  CardGiftcard as CardGiftcardIcon,
  ViewCarousel as ViewCarouselIcon,
  LocalActivity as LocalActivityIcon,
  EmojiEvents as EmojiEventsIcon,
  SportsEsports as SportsEsportsIcon,
  ShoppingCart as ShoppingCartIcon,
  GridView as GridViewIcon,
  Payments as PaymentsIcon,
  Redeem as RedeemIcon,
  Flag as FlagIcon,
  Badge as BadgeIcon,
  Explore as ExploreIcon,
  SportsMma as SportsMmaIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  PinDrop as PinDropIcon,
  Face as FaceIcon,
  FilterFrames as FilterFramesIcon,
  Chat as ChatIcon,
  Casino as CasinoIcon,
  MilitaryTech as MilitaryTechIcon,
  Today as TodayIcon,
  CalendarMonth as CalendarMonthIcon,
  Tune as TuneIcon,
  Style as StyleIcon,
  Groups as GroupsIcon,
  PlaylistAddCheck as PlaylistAddCheckIcon,
  Assignment as AssignmentIcon,
  LockOpen as LockOpenIcon,
} from "@mui/icons-material";
import { type Navigation } from "@toolpad/core";
import LinearProgress from "@mui/material/LinearProgress";
import { getBaseUrl } from "@/app/utils/global";
import theme from "../theme";
import Image from "next/image";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const GLOBAL_SEGMENTS = ["about", "settings", ""];

const GAMES: { [key: string]: { title: string; icon: JSX.Element } } = {
  chuni: { title: "CHUNITHM", icon: <SportsEsportsIcon /> },
  maimai: { title: "maimai DX", icon: <SportsEsportsIcon /> },
};

const getIconComponent = (iconName: string): JSX.Element | undefined => {
  const iconMap: { [key: string]: JSX.Element } = {
    HomeIcon: <HomeIcon />,
    AlbumIcon: <AlbumIcon />,
    Person2Icon: <Person2Icon />,
    MovieIcon: <MovieIcon />,
    SettingsIcon: <SettingsIcon />,
    InfoIcon: <InfoIcon />,
    EventIcon: <EventIcon />,
    MapIcon: <MapIcon />,
    AutoAwesomeIcon: <AutoAwesomeIcon />,
    CardGiftcardIcon: <CardGiftcardIcon />,
    ViewCarouselIcon: <ViewCarouselIcon />,
    LocalActivityIcon: <LocalActivityIcon />,
    EmojiEventsIcon: <EmojiEventsIcon />,
    ShoppingCartIcon: <ShoppingCartIcon />,
    GridViewIcon: <GridViewIcon />,
    PaymentsIcon: <PaymentsIcon />,
    RedeemIcon: <RedeemIcon />,
    FlagIcon: <FlagIcon />,
    BadgeIcon: <BadgeIcon />,
    ExploreIcon: <ExploreIcon />,
    SportsMmaIcon: <SportsMmaIcon />,
    RecordVoiceOverIcon: <RecordVoiceOverIcon />,
    PinDropIcon: <PinDropIcon />,
    FaceIcon: <FaceIcon />,
    FilterFramesIcon: <FilterFramesIcon />,
    ChatIcon: <ChatIcon />,
    CasinoIcon: <CasinoIcon />,
    MilitaryTechIcon: <MilitaryTechIcon />,
    TodayIcon: <TodayIcon />,
    CalendarMonthIcon: <CalendarMonthIcon />,
    TuneIcon: <TuneIcon />,
    StyleIcon: <StyleIcon />,
    GroupsIcon: <GroupsIcon />,
    PlaylistAddCheckIcon: <PlaylistAddCheckIcon />,
    AssignmentIcon: <AssignmentIcon />,
    LockOpenIcon: <LockOpenIcon />,
  };

  return iconMap[iconName];
};

async function loadGameNavigation(game: string) {
  try {
    const response = await fetch(getBaseUrl(game, "navigation.json"));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const navigationData = await response.json();
    return navigationData
      .filter((item: any) => !GLOBAL_SEGMENTS.includes(item.segment ?? ""))
      .map((item: any) => ({
        ...item,
        icon: item.icon ? getIconComponent(item.icon) : undefined,
      }));
  } catch (error) {
    console.error(`Failed to load navigation for ${game}:`, error);
    return [];
  }
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const [navigation, setNavigation] = useState<Navigation | null>(null);

  useEffect(() => {
    const games = Object.entries(GAMES);
    Promise.all(games.map(([game]) => loadGameNavigation(game)))
      .then((gameNavs) => {
        const nav: Navigation = [
          { segment: "", title: "Home", icon: <HomeIcon /> },
          ...games.map(([game, { title, icon }], i) => ({
            segment: game,
            title,
            icon,
            children: gameNavs[i],
          })),
          { kind: "divider" as const },
          { segment: "about", title: "About", icon: <InfoIcon /> },
          { segment: "settings", title: "Settings", icon: <SettingsIcon /> },
        ];
        setNavigation(nav);
      })
      .catch((error) => {
        console.error("Failed to load navigation data:", error);
      });
  }, []);

  const version = "0.0.8";
  const BRANDING = {
    title: `Chuni Viewer ${version}`,
    logo: <Image src="/favicon.ico" width="40" height="40" alt=""></Image>,
  };

  if (!navigation) {
    return (
      <html>
        <body>
          <LinearProgress />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" data-toolpad-color-scheme="light" suppressHydrationWarning>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <React.Suspense fallback={<LinearProgress />}>
            <NextAppProvider
              navigation={navigation}
              branding={BRANDING}
              theme={theme}
            >
              {props.children}
            </NextAppProvider>
          </React.Suspense>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
