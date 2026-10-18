// NEXT_PUBLIC_USE_LOCAL_DATA=true (npm run dev:local) reads data from public/ instead of the file server.
export const SERVER_URL =
  process.env.NEXT_PUBLIC_USE_LOCAL_DATA === "true" ? "" : process.env.NEXT_PUBLIC_SERVER_URL;

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
    "23000": "VERSE",
    "24000": "X-VERSE",
    "24500": "X-VERSE-X",
    "25000": "MATE"
  },
  maimai: {
    "10000": "DX",
    "11000": "DX PLUS",
    "11400": "SPLASH",
    "11700": "SPLASH PLUS",
    "12000": "UNiVERSE",
    "12500": "UNiVERSE PLUS",
    "13000": "FESTiVAL",
    "13500": "FESTiVAL PLUS",
    "14000": "BUDDiES",
    "14500": "BUDDiES PLUS",
    "15000": "PRiSM",
    "15500": "PRiSM PLUS",
    "16000": "CiRCLE",
    "16500": "CiRCLE PLUS",
    "17000": "MAGiCAL"
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
