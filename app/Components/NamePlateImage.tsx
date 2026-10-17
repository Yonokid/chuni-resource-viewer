import { getBaseUrl } from "@/app/utils/global";
import type { NamePlate } from "@/app/(dashboard)/chuni/namePlate/page";

const NamePlateImage = ({ plate, width }: { plate: NamePlate; width: number }) => (
  <img src={getBaseUrl("chuni", `namePlate/${plate.image}`)} alt="" width={width} />
);

export default NamePlateImage;
