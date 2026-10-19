// $n is the game's line break inside dialog text
export const dialogText = (text?: string) => (text ?? "").replaceAll("$n", "\n");
