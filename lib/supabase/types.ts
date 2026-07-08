// Database interface types mapping the Supabase tables structure for static type checking

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          description: string | null
          category: string
          platform: string
          cover_image: string | null
          gallery: Json | null
          tech_stack: Json | null
          status: string
          featured: boolean
          sort_order: number
          seo_title: string | null
          seo_description: string | null
          client_name: string | null
          industry: string | null
          published_at: string | null
          created_by: string | null
          theme_color: string | null
          is_featured: boolean
          is_published: boolean
          gallery_layout: string | null
          device_preview: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          description?: string | null
          category?: string
          platform?: string
          cover_image?: string | null
          gallery?: Json | null
          tech_stack?: Json | null
          status?: string
          featured?: boolean
          sort_order?: number
          seo_title?: string | null
          seo_description?: string | null
          client_name?: string | null
          industry?: string | null
          published_at?: string | null
          created_by?: string | null
          theme_color?: string | null
          is_featured?: boolean
          is_published?: boolean
          gallery_layout?: string | null
          device_preview?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          description?: string | null
          category?: string
          platform?: string
          cover_image?: string | null
          gallery?: Json | null
          tech_stack?: Json | null
          status?: string
          featured?: boolean
          sort_order?: number
          seo_title?: string | null
          seo_description?: string | null
          client_name?: string | null
          industry?: string | null
          published_at?: string | null
          created_by?: string | null
          theme_color?: string | null
          is_featured?: boolean
          is_published?: boolean
          gallery_layout?: string | null
          device_preview?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          id: string
          brand_name: string
          hero_title: string | null
          hero_subtitle: string | null
          hero_description: string | null
          email: string | null
          phone: string | null
          address: string | null
          instagram: string | null
          linkedin: string | null
          github: string | null
          behance: string | null
          logo_url: string | null
          favicon_url: string | null
          meta_title: string | null
          meta_description: string | null
          default_og_image: string | null
          analytics_id: string | null
          theme: string
          accent_color: string
          contact_title: string | null
          contact_description: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          brand_name?: string
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_description?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          instagram?: string | null
          linkedin?: string | null
          github?: string | null
          behance?: string | null
          logo_url?: string | null
          favicon_url?: string | null
          meta_title?: string | null
          meta_description?: string | null
          default_og_image?: string | null
          analytics_id?: string | null
          theme?: string
          accent_color?: string
          default_locale?: string
          contact_title?: string | null
          contact_description?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          brand_name?: string
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_description?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          instagram?: string | null
          linkedin?: string | null
          github?: string | null
          behance?: string | null
          logo_url?: string | null
          favicon_url?: string | null
          meta_title?: string | null
          meta_description?: string | null
          default_og_image?: string | null
          analytics_id?: string | null
          theme?: string
          accent_color?: string
          default_locale?: string
          contact_title?: string | null
          contact_description?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      navigation: {
        Row: {
          id: string
          title: string
          href: string
          position: string
          visible: boolean
          sort_order: number
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          href: string
          position?: string
          visible?: boolean
          sort_order?: number
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          href?: string
          position?: string
          visible?: boolean
          sort_order?: number
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "navigation_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation"
            referencedColumns: ["id"]
          }
        ]
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          created_at: string
          source: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          source?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          source?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
