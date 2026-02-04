export type UserRole = 'student' | 'major_head' | 'international'

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'revision'
  | 'validated_major'
  | 'validated_final'
  | 'rejected'

export type CourseLevel = 'M1' | 'M2'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: UserRole
          major_id: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role: UserRole
          major_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: UserRole
          major_id?: string | null
          created_at?: string
        }
      }
      majors: {
        Row: {
          id: string
          name: string
          code: string
        }
        Insert: {
          id?: string
          name: string
          code: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
        }
      }
      academic_years: {
        Row: {
          id: string
          year: string
          is_current: boolean
        }
        Insert: {
          id?: string
          year: string
          is_current?: boolean
        }
        Update: {
          id?: string
          year?: string
          is_current?: boolean
        }
      }
      applications: {
        Row: {
          id: string
          student_id: string
          major_head_id: string
          academic_year_id: string
          status: ApplicationStatus
          university_name: string
          university_city: string
          university_country: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          major_head_id: string
          academic_year_id: string
          status?: ApplicationStatus
          university_name: string
          university_city: string
          university_country: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          major_head_id?: string
          academic_year_id?: string
          status?: ApplicationStatus
          university_name?: string
          university_city?: string
          university_country?: string
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          application_id: string
          title: string
          language: string
          description: string
          web_link: string
          level: CourseLevel
          start_date: string
          end_date: string
          local_credits: number | null
          ects: number
          choice_reason: string
          is_validated: boolean | null
          rejection_reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          application_id: string
          title: string
          language: string
          description: string
          web_link: string
          level: CourseLevel
          start_date: string
          end_date: string
          local_credits?: number | null
          ects: number
          choice_reason: string
          is_validated?: boolean | null
          rejection_reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          title?: string
          language?: string
          description?: string
          web_link?: string
          level?: CourseLevel
          start_date?: string
          end_date?: string
          local_credits?: number | null
          ects?: number
          choice_reason?: string
          is_validated?: boolean | null
          rejection_reason?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          application_id: string
          sender_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          application_id: string
          sender_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          sender_id?: string
          content?: string
          created_at?: string
        }
      }
      files: {
        Row: {
          id: string
          application_id: string
          message_id: string | null
          uploader_id: string
          file_name: string
          file_path: string
          file_size: number
          created_at: string
        }
        Insert: {
          id?: string
          application_id: string
          message_id?: string | null
          uploader_id: string
          file_name: string
          file_path: string
          file_size: number
          created_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          message_id?: string | null
          uploader_id?: string
          file_name?: string
          file_path?: string
          file_size?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      application_status: ApplicationStatus
      course_level: CourseLevel
    }
  }
}

// Types utilitaires pour faciliter l'utilisation
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Major = Database['public']['Tables']['majors']['Row']
export type AcademicYear = Database['public']['Tables']['academic_years']['Row']
export type Application = Database['public']['Tables']['applications']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type File = Database['public']['Tables']['files']['Row']

// Types avec relations
export type ApplicationWithRelations = Application & {
  student: Profile
  major_head: Profile
  academic_year: AcademicYear
  courses: Course[]
  messages: (Message & { sender: Profile })[]
  files: File[]
}
