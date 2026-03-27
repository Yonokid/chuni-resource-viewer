export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const gameVersions: { [game: string]: { [key: string]: string } } = {
  chuni: {
    "10000": "CHUNITHM",
    "10500": "CHUNITHM PLUS",
    "11000": "AIR",
    "11500": "AIR PLUS",
    "12000": "STAR",
    "12500": "STAR PLUS",
    "13000": "AMAZON",
    "13500": "AMAZON PLUS",
    "14000": "CRYSTAL",
    "14500": "CRYSTAL PLUS",
    "15000": "PARADISE (LOST)",
    "20000": "NEW!!",
    "20500": "NEW!! PLUS",
    "21000": "SUN",
    "21500": "SUN PLUS",
    "22000": "LUMINOUS",
    "22500": "LUMINOUS PLUS",
  },
  maimai: {
    "10000": "maimai DX",
    "16000": "maimai DX CiRCLE",
  },
};
export function getBaseUrl(game: string, path: string = ""): string {
  const version = getVersion(game);
  return path
    ? `${SERVER_URL}/${game}/${version}/${path}`
    : `${SERVER_URL}/${game}/${version}`;
}
export function setVersion(game: string, version: string): void {
  localStorage.setItem(`${game}_version`, version);
}
export function getVersion(game: string): string {
  return (
    localStorage.getItem(`${game}_version`) ??
    Object.keys(gameVersions[game])[0]
  );
}
