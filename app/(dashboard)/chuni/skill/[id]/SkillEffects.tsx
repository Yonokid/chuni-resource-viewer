import { Chip, Paper, Stack, Typography } from "@mui/material";
import { Substance } from "../page";
import { Enums, intLabel, tableName } from "@/app/utils/enums";
import { AssetRef } from "@/app/Components/AssetLink";

const KIND_LABELS: Record<string, string> = {
  gaugeAssist: "Gauge assist",
  gaugeKeep: "Gauge keep",
  damageGuard: "Damage guard",
  deathPenalty: "Forced game over",
  changeJudgeIni: "Stricter judge timing",
  changeJudgeResult: "Judge conversion",
  changeImg: "Appearance change",
  changeSpeed: "Note speed change",
};

interface Section {
  rateSetting: boolean;
  startPos: number;
  endPos: number;
}

// Field values equal to these are the XML defaults and say nothing about the skill.
const isDefault = (v: unknown) =>
  v === null || v === undefined || v === false || v === 0 || v === -1 || (Array.isArray(v) && v.length === 0);

const sectionText = (s: Section | undefined) => {
  if (!s || (s.startPos === 0 && s.endPos === 0)) return null;
  const unit = s.rateSetting ? "%" : "s"; // without rateSetting the positions are seconds (game code 0xe84b90)
  return `${s.startPos}${unit} → ${s.endPos ? `${s.endPos}${unit}` : "end"}`;
};

/** Chips for one effect block: only fields that differ from the defaults, with enum labels. */
const chipsFor = (enums: Enums | null, fields: Record<string, unknown>): React.ReactNode[] => {
  const chips: React.ReactNode[] = [];
  const add = (key: string, label: string) => chips.push(<Chip key={key} size="small" label={label} />);
  for (const [key, value] of Object.entries(fields)) {
    if (isDefault(value)) continue;
    switch (key) {
      case "timing":
        chips.push(...chipsFor(enums, value as Record<string, unknown>));
        break;
      case "section":
        if (sectionText(value as Section)) add(key, `Section ${sectionText(value as Section)}`);
        break;
      case "useSection":
        break; // shown through `section`
      case "scene":
        add(key, intLabel(enums, "skill.timing.scene", value as number));
        break;
      case "award":
        add(key, `On ${intLabel(enums, "skill.timing.award", value as number)}`);
        break;
      case "notesJudgeResultRange":
        add(key, `Judge ${intLabel(enums, "skill.timing.notesJudgeResultRange", value as number).toLowerCase()}`);
        break;
      case "notesJudgeResult":
        add(key, tableName(enums, "notesJudgeResult", value as string));
        break;
      case "notesTypes":
        add(key, `Notes: ${(value as string[]).join(", ")}`);
        break;
      case "playOptionSpeed":
        add(key, `Speed ${tableName(enums, "playOptionSpeed", value as string)}`);
        break;
      case "iniFile":
        add(key, `Timing: ${(value as AssetRef).name}`);
        break;
      case "rateAddGauge":
        add(key, `Gauge gain ${value}%`);
        break;
      case "damageRate":
        add(key, `Damage ${value}%`);
        break;
      case "valueAddGauge":
        add(key, `+${value} gauge`);
        break;
      case "time":
        add(key, `Every ${value}s`);
        break;
      case "comboNum":
        add(key, `Every ${value} combo`);
        break;
      case "missNum":
        add(key, `Every ${value} MISS`);
        break;
      case "chainNum":
        add(key, `Every ${value} chain`);
        break;
      case "gaugeNum":
        add(key, `Gauge crosses ${value}`);
        break;
      case "notesGroupJudge":
        add(key, "Grouped with previous effect");
        break;
      case "useNumNoAccess":
        add(key, "Doesn't use up a use");
        break;
      default:
        add(key, value === true ? key : `${key}: ${value}`);
    }
  }
  return chips;
};

const SkillEffects = ({ substances, enums }: { substances: Substance[]; enums: Enums | null }) => (
  <>
    {substances.map((sub, index) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { type, kind, skillIconType, ...fields } = sub;
      // damageRate 100 is "normal damage", not a guard effect.
      if (kind === "damageGuard" && fields.damageRate === 100) delete fields.damageRate;
      return (
        <Paper key={index} sx={{ padding: 2, marginBottom: 1, maxWidth: 800 }}>
          <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
            {KIND_LABELS[kind] ?? kind}
          </Typography>
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
            {chipsFor(enums, fields)}
          </Stack>
        </Paper>
      );
    })}
  </>
);

export default SkillEffects;
