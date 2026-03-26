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
  chuni: { title: "Chunithm", icon: <SportsEsportsIcon /> },
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

  const version = "0.0.3";
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
