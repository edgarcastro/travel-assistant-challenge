import { useEffect, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import type { AuthUser } from "aws-amplify/auth";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { ExclamationTriangleIcon, PlusIcon } from "@heroicons/react/20/solid";
import TravelList from "./components/TravelList";
import TravelFormModal from "./components/TravelFormModal";
import destinations from "./fixtures/destinations.json";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  type TravelEntry,
} from "./apiService";
import type { TravelItem } from "shared";

const cityName = Object.fromEntries(destinations.map((d) => [d.code, d.name]));

const DEV_AUTH = import.meta.env.VITE_DEV_AUTH === "true";
const DEV_USER = {
  signInDetails: { loginId: "edgar.castro.villa@outlook.com" },
};

type User = AuthUser | typeof DEV_USER;

function AppContent({ user, signOut }: { user: User; signOut?: () => void }) {
  const userId = user.signInDetails!.loginId!;

  const [items, setItems] = useState<TravelEntry[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TravelEntry | undefined>();
  const [deletingItem, setDeletingItem] = useState<TravelEntry | undefined>();

  useEffect(() => {
    getItems(userId).then(setItems);
  }, [userId]);

  const openCreate = () => {
    setEditingItem(undefined);
    setModalOpen(true);
  };

  const openEdit = (item: TravelEntry) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleSave = async (
    data: Pick<TravelItem, "countryCode" | "city" | "priority" | "notes">
  ) => {
    if (editingItem) {
      const updated = await updateItem(editingItem.id, data);
      setItems((prev) =>
        prev.map((i) => (i.id === editingItem.id ? updated : i))
      );
    } else {
      const created = await createItem({ ...data, userId });
      setItems((prev) => [...prev, created]);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    await deleteItem(deletingItem.id);
    setItems((prev) => prev.filter((i) => i.id !== deletingItem.id));
    setDeletingItem(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Colombia Travel Wishlist</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{userId}</span>
          {signOut && (
            <Button size="sm" variant="light" onPress={signOut}>
              Cerrar sesión
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-4">
        <div className="flex justify-end">
          <Button
            color="primary"
            startContent={<PlusIcon className="h-4 w-4" />}
            onPress={openCreate}
          >
            Agregar destino
          </Button>
        </div>

        <TravelList items={items} onEdit={openEdit} onDelete={setDeletingItem} />
      </main>

      <TravelFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        item={editingItem}
        selectedCities={items
          .filter((i) => i.city !== editingItem?.city)
          .map((i) => i.city)}
      />

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(undefined)}
        placement="center"
        size="sm"
      >
        <ModalContent>
          <ModalHeader className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-danger" />
            Eliminar destino
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-gray-600">
              ¿Estás seguro de que deseas eliminar{" "}
              <span className="font-medium">
                {deletingItem ? cityName[deletingItem.city] ?? deletingItem.city : ""}
              </span>
              ? Esta acción no se puede deshacer.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setDeletingItem(undefined)}>
              Cancelar
            </Button>
            <Button color="danger" onPress={handleDeleteConfirm}>
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default function App() {
  if (DEV_AUTH) {
    return <AppContent user={DEV_USER} />;
  }

  return (
    <Authenticator loginMechanisms={["email"]}>
      {({ signOut, user }) => <AppContent user={user!} signOut={signOut} />}
    </Authenticator>
  );
}
