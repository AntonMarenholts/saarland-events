import EventForm from "@/components/EventForm";

export default function AdminPage() {
  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Добавить новое событие</h1>
      <EventForm />
    </main>
  );
}
