import { Chip } from "@heroui/react";

type ChipColor = "primary" | "success" | "warning" | "danger";

const WEATHER_CONFIG: Record<string, { label: string; emoji: string; color: ChipColor }> = {
  COLD: { label: "Frío", emoji: "❄️", color: "primary" },
  DRY_COLD: { label: "Seco y frío", emoji: "🌬️", color: "primary" },
  MILD: { label: "Templado", emoji: "🌤️", color: "success" },
  DRY_WARM: { label: "Seco y cálido", emoji: "🌵", color: "warning" },
  HOT: { label: "Caluroso", emoji: "☀️", color: "warning" },
  HOT_DRY: { label: "Caluroso y seco", emoji: "🏜️", color: "warning" },
  HOT_HUMID: { label: "Caluroso y húmedo", emoji: "💦", color: "warning" },
  TROPICAL: { label: "Tropical", emoji: "🌴", color: "success" },
  VERY_HOT: { label: "Muy caluroso", emoji: "🔥", color: "danger" },
  VERY_HOT_HUMID: {
    label: "Muy caluroso y húmedo",
    emoji: "🌊",
    color: "danger",
  },
};

export type WeatherCode = keyof typeof WEATHER_CONFIG;

interface Props {
  weatherCode: WeatherCode;
}

export default function WeatherBadge({ weatherCode }: Props) {
  const config = WEATHER_CONFIG[weatherCode];
  if (!config) return null;
  return (
    <Chip size="sm" variant="flat" color={config.color}>
      {config.emoji} {config.label}
    </Chip>
  );
}
