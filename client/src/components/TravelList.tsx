import { Button, Chip } from "@heroui/react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import type { TravelEntry } from "../apiService";
import destinations from "../fixtures/destinations.json";
import WeatherBadge, { type WeatherCode } from "./WeatherBadge";

const destByCode = Object.fromEntries(destinations.map((d) => [d.code, d]));

const PRIORITY_COLOR = {
  low: "success",
  medium: "warning",
  high: "danger",
} as const;

const PRIORITY_LABEL = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
} as const;

interface Props {
  items: TravelEntry[];
  onEdit: (item: TravelEntry) => void;
  onDelete: (item: TravelEntry) => void;
}

export default function TravelList({ items, onEdit, onDelete }: Props) {
  if (items.length === 0) {
    return (
      <p className="text-center text-sm text-default-400 py-12">
        Aún no hay destinos. ¡Agrega uno!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const dest = destByCode[item.city];
        return (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-default-200 p-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4"
          >
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-base leading-tight">
                  {dest?.name || item.city}
                </span>
                <span className="text-xs text-default-400">🇨🇴 Colombia</span>
                {item.priority && (
                  <Chip
                    size="sm"
                    color={PRIORITY_COLOR[item.priority]}
                    variant="flat"
                  >
                    {PRIORITY_LABEL[item.priority]}
                  </Chip>
                )}
              </div>

              {dest && (
                <WeatherBadge weatherCode={dest.weatherCode as WeatherCode} />
              )}

              {dest?.description && (
                <p className="text-sm text-default-500 leading-snug line-clamp-2">
                  {dest.description}
                </p>
              )}

              {item.notes && (
                <p className="text-xs text-default-400 italic">{item.notes}</p>
              )}
            </div>

            <div className="flex gap-1 self-start shrink-0">
              <Button
                isIconOnly
                size="sm"
                color="secondary"
                aria-label="Editar"
                onPress={() => onEdit(item)}
              >
                <PencilSquareIcon className="h-5 w-5" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                color="danger"
                aria-label="Eliminar"
                onPress={() => onDelete(item)}
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
