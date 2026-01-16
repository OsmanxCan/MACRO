// app/page.tsx (Server Component)
import { getAbout, getAnnouncements, getEvents } from "@/lib/supabase/queries";
import HomePage from "../components/Page/clientspage";

export default async function Page() {
  const announcements = await getAnnouncements();
  const events = await getEvents();
  const about = await getAbout();

  return <HomePage announcements={announcements} events={events} about={about} />;
}