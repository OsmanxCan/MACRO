import { createSupabaseServer } from "./server"

export async function getAnnouncements() {
  const supabase = await createSupabaseServer()
  const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false })
  return data ?? []
}

export async function getEvents() {
  const supabase = await createSupabaseServer()
  const { data } = await supabase.from("events").select("*").order("date", { ascending: true })
  return data ?? []
}

export async function getAbout() {
  const supabase = await createSupabaseServer()
  const { data } = await supabase.from("about").select("*").limit(1).single()
  return data ?? { content: "" }
}


export async function getAnnouncementById(id: string) {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .single()
  
  if (error) return null
  return data
}

// Tek bir etkinlik getir
export async function getEventById(id: string) {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single()
  
  if (error) return null
  return data
}