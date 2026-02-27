import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Textarea,
  SharedSelection,
} from "@heroui/react";
import type { TravelEntry } from "../apiService";
import type { TravelItem } from "shared";
import destinations from "../fixtures/destinations.json";
import WeatherBadge, { type WeatherCode } from "./WeatherBadge";

type FormData = Pick<TravelItem, "countryCode" | "city" | "priority" | "notes">;

const PRIORITY_OPTIONS = [
  { key: "low", label: "Baja" },
  { key: "medium", label: "Media" },
  { key: "high", label: "Alta" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
  item?: TravelEntry;
  selectedCities?: string[];
}

const initial: FormData = {
  countryCode: "CO",
  city: "",
  priority: undefined,
  notes: "",
};

export default function TravelFormModal({
  isOpen,
  onClose,
  onSave,
  item,
  selectedCities = [],
}: Props) {
  const [form, setForm] = useState<FormData>(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(
      item
        ? {
            countryCode: "CO",
            city: item.city,
            priority: item.priority,
            notes: item.notes ?? "",
          }
        : initial,
    );
  }, [item, isOpen]);

  const handleSave = async () => {
    if (!form.city) return;
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const selectedDest = destinations.find((d) => d.code === form.city);

  const handleCitySelection = (keys: SharedSelection) => {
    const code = [...keys][0] as string | undefined;
    setForm((prev) => ({ ...prev, city: code ?? "" }));
  };

  const handlePrioritySelection = (keys: SharedSelection) => {
    const val = [...keys][0] as TravelItem["priority"] | undefined;
    setForm((prev) => ({ ...prev, priority: val }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        <ModalHeader>{item ? "Editar destino" : "Nuevo destino"}</ModalHeader>
        <ModalBody className="gap-4">
          <Select label="País" isDisabled selectedKeys={["CO"]}>
            <SelectItem key="CO">🇨🇴 Colombia</SelectItem>
          </Select>

          <Select
            label="Ciudad"
            placeholder="Selecciona una ciudad"
            selectedKeys={form.city ? [form.city] : []}
            disabledKeys={selectedCities}
            onSelectionChange={handleCitySelection}
            isRequired
          >
            {destinations.map((d) => (
              <SelectItem key={d.code}>{d.name}</SelectItem>
            ))}
          </Select>

          {selectedDest && (
            <div className="rounded-lg bg-default-50 border border-default-200 p-3 space-y-2">
              <WeatherBadge
                weatherCode={selectedDest.weatherCode as WeatherCode}
              />
              <p className="text-sm text-default-600">
                {selectedDest.description}
              </p>
            </div>
          )}

          <Select
            label="Prioridad"
            placeholder="Ninguna"
            selectedKeys={form.priority ? [form.priority] : []}
            onSelectionChange={handlePrioritySelection}
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <SelectItem key={opt.key}>{opt.label}</SelectItem>
            ))}
          </Select>

          <Textarea
            label="Notas"
            placeholder="Cualquier nota..."
            value={form.notes ?? ""}
            onValueChange={(value) =>
              setForm((prev) => ({ ...prev, notes: value || undefined }))
            }
            minRows={2}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={saving}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={handleSave}
            isLoading={saving}
            isDisabled={!form.city}
          >
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
