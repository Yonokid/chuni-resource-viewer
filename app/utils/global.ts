import * as path from "path";

export function getAbsolutePath(relativePath: string): string {
  return path.resolve(__dirname, relativePath);
}

export const gameVersion: { [key: string]: string } = {
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
};
export function setVersion(version: string): void {
  localStorage.setItem("version", version);
}
export function getVersion(): string {
  return localStorage.getItem("version") ?? "10000";
}
