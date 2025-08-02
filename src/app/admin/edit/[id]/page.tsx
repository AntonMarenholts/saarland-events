import { getEventForEdit } from "../../actions";
import EditEventForm from "./EditEventForm";

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const eventId = Number(params.id);
  
  // Безопасно получаем данные на сервере
  const { eventData, allCategories } = await getEventForEdit(eventId);

  if (!eventData) {
    return <p className="text-center p-8">Событие не найдено.</p>;
  }

  // Передаем данные в клиентский компонент формы
  return <EditEventForm eventData={eventData} allCategories={allCategories} />;
}
