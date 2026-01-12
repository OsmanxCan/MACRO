export interface Announcement {
  id: string
  title: string
  content: string
  image_url: string | null
  image_file: string | null
  link: string | null
  video_url: string | null
  video_file: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  created_by: string
  image_url: string | null
  link: string | null
  image_file: string | null
  video_url: string | null
  video_file: string | null
}