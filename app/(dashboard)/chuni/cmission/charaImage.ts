import { AssetRef } from "@/app/Components/AssetLink";
import { getBaseUrl } from "@/app/utils/global";

export const charaImage = (chara: AssetRef) =>
  getBaseUrl("chuni", `chara/CHU_UI_Character_${(chara.id / 10).toString().padStart(4, "0")}_00_02.webp`);
