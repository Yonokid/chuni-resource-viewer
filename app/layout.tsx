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
} from "@mui/icons-material";
import LinearProgress from "@mui/material/LinearProgress";
import { getVersion } from "@/app/utils/global";
import theme from "../theme";
import Image from "next/image";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

interface NavigationItem {
  kind?: "page";
  segment?: string;
  title: string;
  icon?: JSX.Element;
}

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

async function loadNavigation() {
  try {
    const server_url = process.env.NEXT_PUBLIC_SERVER_URL;
    const navigationData = await import(
      `/${server_url}/${getVersion()}/navigation.json`
    );

    // Map the data to the NAVIGATION constant
    const NAVIGATION = navigationData.default.map((item: any) => ({
      ...item,
      icon: item.icon ? getIconComponent(item.icon) : undefined,
    }));

    return NAVIGATION;
  } catch (error) {
    console.error("Failed to load navigation data:", error);
    return [];
  }
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const [navigation, setNavigation] = useState<NavigationItem[] | null>(null);

  useEffect(() => {
    // Load the navigation data asynchronously
    loadNavigation()
      .then((data) => {
        setNavigation(data);
      })
      .catch((error) => {
        console.error("Failed to load navigation data:", error);
      });
  }, []);

  const version = "0.0.1";
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
