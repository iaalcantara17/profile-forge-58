export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      application_events: {
        Row: {
          event_date: string | null
          event_type: string
          id: string
          job_id: string
          metadata: Json | null
          notes: string | null
          user_id: string
        }
        Insert: {
          event_date?: string | null
          event_type: string
          id?: string
          job_id: string
          metadata?: Json | null
          notes?: string | null
          user_id: string
        }
        Update: {
          event_date?: string | null
          event_type?: string
          id?: string
          job_id?: string
          metadata?: Json | null
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_events_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      application_status_history: {
        Row: {
          changed_at: string
          from_status: string | null
          id: string
          job_id: string
          notes: string | null
          to_status: string
          user_id: string
        }
        Insert: {
          changed_at?: string
          from_status?: string | null
          id?: string
          job_id: string
          notes?: string | null
          to_status: string
          user_id: string
        }
        Update: {
          changed_at?: string
          from_status?: string | null
          id?: string
          job_id?: string
          notes?: string | null
          to_status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_status_history_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_rule_runs: {
        Row: {
          dedupe_key: string | null
          id: string
          job_id: string | null
          message: string | null
          outcome: string
          rule_id: string
          run_at: string
          user_id: string
        }
        Insert: {
          dedupe_key?: string | null
          id?: string
          job_id?: string | null
          message?: string | null
          outcome: string
          rule_id: string
          run_at?: string
          user_id: string
        }
        Update: {
          dedupe_key?: string | null
          id?: string
          job_id?: string | null
          message?: string | null
          outcome?: string
          rule_id?: string
          run_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_rule_runs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_rule_runs_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "automation_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_rules: {
        Row: {
          action: Json
          config: Json | null
          created_at: string | null
          enabled: boolean | null
          id: string
          is_enabled: boolean
          name: string
          rule_type: string
          trigger: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action?: Json
          config?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          is_enabled?: boolean
          name?: string
          rule_type: string
          trigger?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action?: Json
          config?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          is_enabled?: boolean
          name?: string
          rule_type?: string
          trigger?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      calendar_integrations: {
        Row: {
          access_token: string | null
          calendar_id: string | null
          created_at: string | null
          id: string
          last_sync: string | null
          provider: string
          refresh_token: string | null
          sync_enabled: boolean | null
          token_expiry: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          calendar_id?: string | null
          created_at?: string | null
          id?: string
          last_sync?: string | null
          provider: string
          refresh_token?: string | null
          sync_enabled?: boolean | null
          token_expiry?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          calendar_id?: string | null
          created_at?: string | null
          id?: string
          last_sync?: string | null
          provider?: string
          refresh_token?: string | null
          sync_enabled?: boolean | null
          token_expiry?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      company_research: {
        Row: {
          ai_summary: string | null
          company_name: string
          competitors: Json | null
          created_at: string | null
          culture: string | null
          description: string | null
          glassdoor_rating: number | null
          id: string
          industry: string | null
          key_people: Json | null
          recent_news: Json | null
          size: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          company_name: string
          competitors?: Json | null
          created_at?: string | null
          culture?: string | null
          description?: string | null
          glassdoor_rating?: number | null
          id?: string
          industry?: string | null
          key_people?: Json | null
          recent_news?: Json | null
          size?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          company_name?: string
          competitors?: Json | null
          created_at?: string | null
          culture?: string | null
          description?: string | null
          glassdoor_rating?: number | null
          id?: string
          industry?: string | null
          key_people?: Json | null
          recent_news?: Json | null
          size?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contact_interactions: {
        Row: {
          contact_id: string
          created_at: string
          id: string
          interaction_date: string
          interaction_type: string
          notes: string | null
          outcome: string | null
          user_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          id?: string
          interaction_date?: string
          interaction_type: string
          notes?: string | null
          outcome?: string | null
          user_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          id?: string
          interaction_date?: string
          interaction_type?: string
          notes?: string | null
          outcome?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_interactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_job_links: {
        Row: {
          contact_id: string
          created_at: string
          id: string
          job_id: string
          user_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          id?: string
          job_id: string
          user_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          id?: string
          job_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_job_links_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_job_links_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_reminders: {
        Row: {
          completed: boolean
          contact_id: string
          created_at: string
          id: string
          notes: string | null
          reminder_date: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          contact_id: string
          created_at?: string
          id?: string
          notes?: string | null
          reminder_date: string
          user_id: string
        }
        Update: {
          completed?: boolean
          contact_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          reminder_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_reminders_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          id: string
          interests: string | null
          last_contacted_at: string | null
          name: string
          notes: string | null
          phone: string | null
          relationship_strength: number | null
          relationship_type: string | null
          role: string | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          interests?: string | null
          last_contacted_at?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          relationship_strength?: number | null
          relationship_type?: string | null
          role?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          interests?: string | null
          last_contacted_at?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          relationship_strength?: number | null
          relationship_type?: string | null
          role?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cover_letter_analytics: {
        Row: {
          cover_letter_id: string
          created_at: string | null
          id: string
          job_id: string | null
          opened: boolean | null
          outcome: string | null
          responded: boolean | null
          response_time_hours: number | null
          sent_at: string | null
          updated_at: string | null
          user_id: string
          variant_name: string | null
        }
        Insert: {
          cover_letter_id: string
          created_at?: string | null
          id?: string
          job_id?: string | null
          opened?: boolean | null
          outcome?: string | null
          responded?: boolean | null
          response_time_hours?: number | null
          sent_at?: string | null
          updated_at?: string | null
          user_id: string
          variant_name?: string | null
        }
        Update: {
          cover_letter_id?: string
          created_at?: string | null
          id?: string
          job_id?: string | null
          opened?: boolean | null
          outcome?: string | null
          responded?: boolean | null
          response_time_hours?: number | null
          sent_at?: string | null
          updated_at?: string | null
          user_id?: string
          variant_name?: string | null
        }
        Relationships: []
      }
      cover_letters: {
        Row: {
          ai_generated: Json | null
          company_research: Json | null
          content: string | null
          created_at: string | null
          id: string
          is_archived: boolean | null
          job_id: string | null
          last_used: string | null
          response_rate: number | null
          style_preferences: Json | null
          template: string | null
          times_used: number | null
          title: string
          tone: string | null
          updated_at: string | null
          user_id: string
          versions: Json | null
        }
        Insert: {
          ai_generated?: Json | null
          company_research?: Json | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          job_id?: string | null
          last_used?: string | null
          response_rate?: number | null
          style_preferences?: Json | null
          template?: string | null
          times_used?: number | null
          title: string
          tone?: string | null
          updated_at?: string | null
          user_id: string
          versions?: Json | null
        }
        Update: {
          ai_generated?: Json | null
          company_research?: Json | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          job_id?: string | null
          last_used?: string | null
          response_rate?: number | null
          style_preferences?: Json | null
          template?: string | null
          times_used?: number | null
          title?: string
          tone?: string | null
          updated_at?: string | null
          user_id?: string
          versions?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "cover_letters_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      email_integrations: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          id: string
          provider: string
          refresh_token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          id?: string
          provider: string
          refresh_token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          id?: string
          provider?: string
          refresh_token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_tracking: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          detected_status: string | null
          email_body: string | null
          email_subject: string | null
          from_addr: string | null
          id: string
          job_id: string | null
          metadata: Json | null
          processed_at: string | null
          provider_msg_id: string | null
          received_at: string | null
          sender_email: string | null
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          detected_status?: string | null
          email_body?: string | null
          email_subject?: string | null
          from_addr?: string | null
          id?: string
          job_id?: string | null
          metadata?: Json | null
          processed_at?: string | null
          provider_msg_id?: string | null
          received_at?: string | null
          sender_email?: string | null
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          detected_status?: string | null
          email_body?: string | null
          email_subject?: string | null
          from_addr?: string | null
          id?: string
          job_id?: string | null
          metadata?: Json | null
          processed_at?: string | null
          provider_msg_id?: string | null
          received_at?: string | null
          sender_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      interview_checklists: {
        Row: {
          category: string | null
          completed_at: string | null
          created_at: string
          id: string
          interview_id: string
          is_required: boolean
          label: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          interview_id: string
          is_required?: boolean
          label: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          interview_id?: string
          is_required?: boolean
          label?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_checklists_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "interviews"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_followups: {
        Row: {
          created_at: string
          id: string
          interview_id: string
          sent_at: string | null
          status: string
          template_body: string | null
          template_subject: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interview_id: string
          sent_at?: string | null
          status?: string
          template_body?: string | null
          template_subject?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interview_id?: string
          sent_at?: string | null
          status?: string
          template_body?: string | null
          template_subject?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_followups_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "interviews"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_success_predictions: {
        Row: {
          actual_outcome: string | null
          confidence_band: string
          created_at: string
          id: string
          interview_id: string
          outcome_recorded_at: string | null
          predicted_score: number
          prediction_accuracy: number | null
          score_factors: Json
          top_actions: Json
          user_id: string
        }
        Insert: {
          actual_outcome?: string | null
          confidence_band: string
          created_at?: string
          id?: string
          interview_id: string
          outcome_recorded_at?: string | null
          predicted_score: number
          prediction_accuracy?: number | null
          score_factors?: Json
          top_actions?: Json
          user_id: string
        }
        Update: {
          actual_outcome?: string | null
          confidence_band?: string
          created_at?: string
          id?: string
          interview_id?: string
          outcome_recorded_at?: string | null
          predicted_score?: number
          prediction_accuracy?: number | null
          score_factors?: Json
          top_actions?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_success_predictions_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "interviews"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          calendar_event_id: string | null
          common_questions: Json | null
          company_research: Json | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          interview_date: string | null
          interview_type: string | null
          interviewer_name: string | null
          interviewer_names: string[] | null
          interviewer_role: string | null
          job_id: string
          location: string | null
          notes: string | null
          outcome: string | null
          preparation_status: string | null
          reminder_sent: boolean | null
          scheduled_end: string | null
          scheduled_start: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          video_link: string | null
        }
        Insert: {
          calendar_event_id?: string | null
          common_questions?: Json | null
          company_research?: Json | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          interview_date?: string | null
          interview_type?: string | null
          interviewer_name?: string | null
          interviewer_names?: string[] | null
          interviewer_role?: string | null
          job_id: string
          location?: string | null
          notes?: string | null
          outcome?: string | null
          preparation_status?: string | null
          reminder_sent?: boolean | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          video_link?: string | null
        }
        Update: {
          calendar_event_id?: string | null
          common_questions?: Json | null
          company_research?: Json | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          interview_date?: string | null
          interview_type?: string | null
          interviewer_name?: string | null
          interviewer_names?: string[] | null
          interviewer_role?: string | null
          job_id?: string
          location?: string | null
          notes?: string | null
          outcome?: string | null
          preparation_status?: string | null
          reminder_sent?: boolean | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          video_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interviews_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_match_scores: {
        Row: {
          created_at: string | null
          education_score: number | null
          experience_score: number | null
          gaps: Json | null
          id: string
          job_id: string
          overall_score: number
          recommendations: string | null
          skills_score: number | null
          strengths: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          education_score?: number | null
          experience_score?: number | null
          gaps?: Json | null
          id?: string
          job_id: string
          overall_score: number
          recommendations?: string | null
          skills_score?: number | null
          strengths?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          education_score?: number | null
          experience_score?: number | null
          gaps?: Json | null
          id?: string
          job_id?: string
          overall_score?: number
          recommendations?: string | null
          skills_score?: number | null
          strengths?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_match_scores_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          application_deadline: string | null
          archive_reason: string | null
          company_info: Json | null
          company_name: string
          contacts: Json | null
          cover_letter_id: string | null
          created_at: string | null
          id: string
          industry: string | null
          interview_notes: string | null
          is_archived: boolean | null
          job_description: string | null
          job_title: string
          job_type: string | null
          job_url: string | null
          location: string | null
          notes: string | null
          resume_id: string | null
          salary_max: number | null
          salary_min: number | null
          salary_notes: string | null
          status: string
          status_history: Json | null
          status_updated_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          application_deadline?: string | null
          archive_reason?: string | null
          company_info?: Json | null
          company_name: string
          contacts?: Json | null
          cover_letter_id?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          interview_notes?: string | null
          is_archived?: boolean | null
          job_description?: string | null
          job_title: string
          job_type?: string | null
          job_url?: string | null
          location?: string | null
          notes?: string | null
          resume_id?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_notes?: string | null
          status?: string
          status_history?: Json | null
          status_updated_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          application_deadline?: string | null
          archive_reason?: string | null
          company_info?: Json | null
          company_name?: string
          contacts?: Json | null
          cover_letter_id?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          interview_notes?: string | null
          is_archived?: boolean | null
          job_description?: string | null
          job_title?: string
          job_type?: string | null
          job_url?: string | null
          location?: string | null
          notes?: string | null
          resume_id?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_notes?: string | null
          status?: string
          status_history?: Json | null
          status_updated_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      materials_usage: {
        Row: {
          cover_letter_id: string | null
          cover_letter_version_name: string | null
          id: string
          job_id: string
          notes: string | null
          resume_id: string | null
          resume_version_name: string | null
          used_at: string
          user_id: string
        }
        Insert: {
          cover_letter_id?: string | null
          cover_letter_version_name?: string | null
          id?: string
          job_id: string
          notes?: string | null
          resume_id?: string | null
          resume_version_name?: string | null
          used_at?: string
          user_id: string
        }
        Update: {
          cover_letter_id?: string | null
          cover_letter_version_name?: string | null
          id?: string
          job_id?: string
          notes?: string | null
          resume_id?: string | null
          resume_version_name?: string | null
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "materials_usage_cover_letter_id_fkey"
            columns: ["cover_letter_id"]
            isOneToOne: false
            referencedRelation: "cover_letters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materials_usage_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materials_usage_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_interview_responses: {
        Row: {
          answered_at: string | null
          created_at: string
          followup_rationale: string | null
          id: string
          is_followup: boolean
          question_id: string
          question_order: number
          response_text: string | null
          session_id: string
          started_at: string
          time_taken: number | null
        }
        Insert: {
          answered_at?: string | null
          created_at?: string
          followup_rationale?: string | null
          id?: string
          is_followup?: boolean
          question_id: string
          question_order: number
          response_text?: string | null
          session_id: string
          started_at?: string
          time_taken?: number | null
        }
        Update: {
          answered_at?: string | null
          created_at?: string
          followup_rationale?: string | null
          id?: string
          is_followup?: boolean
          question_id?: string
          question_order?: number
          response_text?: string | null
          session_id?: string
          started_at?: string
          time_taken?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mock_interview_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_bank_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mock_interview_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "mock_interview_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_interview_sessions: {
        Row: {
          company_name: string | null
          completed_at: string | null
          created_at: string
          format: string
          id: string
          job_id: string | null
          question_count: number
          started_at: string
          status: string
          target_role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          completed_at?: string | null
          created_at?: string
          format: string
          id?: string
          job_id?: string | null
          question_count: number
          started_at?: string
          status?: string
          target_role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          completed_at?: string | null
          created_at?: string
          format?: string
          id?: string
          job_id?: string | null
          question_count?: number
          started_at?: string
          status?: string
          target_role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mock_interview_summaries: {
        Row: {
          ai_summary: string | null
          avg_response_length: number | null
          completion_rate: number
          created_at: string
          id: string
          session_id: string
          strongest_category: string | null
          top_improvements: Json
          weakest_category: string | null
        }
        Insert: {
          ai_summary?: string | null
          avg_response_length?: number | null
          completion_rate: number
          created_at?: string
          id?: string
          session_id: string
          strongest_category?: string | null
          top_improvements?: Json
          weakest_category?: string | null
        }
        Update: {
          ai_summary?: string | null
          avg_response_length?: number | null
          completion_rate?: number
          created_at?: string
          id?: string
          session_id?: string
          strongest_category?: string | null
          top_improvements?: Json
          weakest_category?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mock_interview_summaries_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "mock_interview_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_interview_id: string | null
          related_job_id: string | null
          sent_via_email: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_interview_id?: string | null
          related_job_id?: string | null
          sent_via_email?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_interview_id?: string | null
          related_job_id?: string | null
          sent_via_email?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_interview_id_fkey"
            columns: ["related_interview_id"]
            isOneToOne: false
            referencedRelation: "interviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_job_id_fkey"
            columns: ["related_job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          base_salary: number | null
          bonus: number | null
          confidence_checklist: Json | null
          created_at: string
          equity: string | null
          id: string
          job_id: string
          level: string | null
          location: string | null
          market_data: Json | null
          notes: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          base_salary?: number | null
          bonus?: number | null
          confidence_checklist?: Json | null
          created_at?: string
          equity?: string | null
          id?: string
          job_id: string
          level?: string | null
          location?: string | null
          market_data?: Json | null
          notes?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          base_salary?: number | null
          bonus?: number | null
          confidence_checklist?: Json | null
          created_at?: string
          equity?: string | null
          id?: string
          job_id?: string
          level?: string | null
          location?: string | null
          market_data?: Json | null
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          certifications: Json | null
          created_at: string | null
          education: Json | null
          email: string | null
          email_reminders: boolean | null
          employment_history: Json | null
          experience_level: string | null
          github_url: string | null
          id: string
          industry: string | null
          linkedin_url: string | null
          location: string | null
          name: string | null
          phone_number: string | null
          portfolio_url: string | null
          professional_headline: string | null
          projects: Json | null
          reminder_days: number[] | null
          skills: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          certifications?: Json | null
          created_at?: string | null
          education?: Json | null
          email?: string | null
          email_reminders?: boolean | null
          employment_history?: Json | null
          experience_level?: string | null
          github_url?: string | null
          id?: string
          industry?: string | null
          linkedin_url?: string | null
          location?: string | null
          name?: string | null
          phone_number?: string | null
          portfolio_url?: string | null
          professional_headline?: string | null
          projects?: Json | null
          reminder_days?: number[] | null
          skills?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          certifications?: Json | null
          created_at?: string | null
          education?: Json | null
          email?: string | null
          email_reminders?: boolean | null
          employment_history?: Json | null
          experience_level?: string | null
          github_url?: string | null
          id?: string
          industry?: string | null
          linkedin_url?: string | null
          location?: string | null
          name?: string | null
          phone_number?: string | null
          portfolio_url?: string | null
          professional_headline?: string | null
          projects?: Json | null
          reminder_days?: number[] | null
          skills?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      question_bank_items: {
        Row: {
          category: string
          created_at: string
          difficulty: string
          id: string
          industry: string | null
          linked_skills: string[] | null
          question_text: string
          role_title: string
          source: string | null
          star_framework_hint: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          difficulty: string
          id?: string
          industry?: string | null
          linked_skills?: string[] | null
          question_text: string
          role_title: string
          source?: string | null
          star_framework_hint?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          difficulty?: string
          id?: string
          industry?: string | null
          linked_skills?: string[] | null
          question_text?: string
          role_title?: string
          source?: string | null
          star_framework_hint?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      question_practice: {
        Row: {
          created_at: string
          id: string
          last_practiced_at: string
          question_id: string
          response_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_practiced_at?: string
          question_id: string
          response_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_practiced_at?: string
          question_id?: string
          response_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_practice_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_bank_items"
            referencedColumns: ["id"]
          },
        ]
      }
      question_practice_feedback: {
        Row: {
          alternative_approaches: string[] | null
          clarity_score: number | null
          created_at: string
          general_feedback: string | null
          id: string
          impact_score: number | null
          overall_score: number | null
          relevance_score: number | null
          response_id: string
          speaking_time_estimate: number | null
          specificity_score: number | null
          star_adherence: Json | null
          weak_language: Json | null
        }
        Insert: {
          alternative_approaches?: string[] | null
          clarity_score?: number | null
          created_at?: string
          general_feedback?: string | null
          id?: string
          impact_score?: number | null
          overall_score?: number | null
          relevance_score?: number | null
          response_id: string
          speaking_time_estimate?: number | null
          specificity_score?: number | null
          star_adherence?: Json | null
          weak_language?: Json | null
        }
        Update: {
          alternative_approaches?: string[] | null
          clarity_score?: number | null
          created_at?: string
          general_feedback?: string | null
          id?: string
          impact_score?: number | null
          overall_score?: number | null
          relevance_score?: number | null
          response_id?: string
          speaking_time_estimate?: number | null
          specificity_score?: number | null
          star_adherence?: Json | null
          weak_language?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "question_practice_feedback_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "question_practice_responses"
            referencedColumns: ["id"]
          },
        ]
      }
      question_practice_responses: {
        Row: {
          created_at: string
          id: string
          question_id: string
          response_text: string
          status: string
          time_taken: number | null
          timer_duration: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          response_text: string
          status?: string
          time_taken?: number | null
          timer_duration?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          response_text?: string
          status?: string
          time_taken?: number | null
          timer_duration?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_practice_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_bank_items"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_requests: {
        Row: {
          contact_id: string
          created_at: string
          id: string
          job_id: string
          last_action_at: string
          message_sent: string | null
          next_followup_at: string | null
          notes: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          id?: string
          job_id: string
          last_action_at?: string
          message_sent?: string | null
          next_followup_at?: string | null
          notes?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          id?: string
          job_id?: string
          last_action_at?: string
          message_sent?: string | null
          next_followup_at?: string | null
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_requests_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_requests_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_comments: {
        Row: {
          author_name: string
          body: string
          created_at: string
          id: string
          share_id: string
        }
        Insert: {
          author_name: string
          body: string
          created_at?: string
          id?: string
          share_id: string
        }
        Update: {
          author_name?: string
          body?: string
          created_at?: string
          id?: string
          share_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_comments_share_id_fkey"
            columns: ["share_id"]
            isOneToOne: false
            referencedRelation: "resume_shares_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_experience_variants: {
        Row: {
          accepted: boolean
          content_markdown: string
          created_at: string
          id: string
          job_id: string | null
          relevance_score: number
          resume_experience_id: string
          user_id: string
        }
        Insert: {
          accepted?: boolean
          content_markdown: string
          created_at?: string
          id?: string
          job_id?: string | null
          relevance_score: number
          resume_experience_id: string
          user_id: string
        }
        Update: {
          accepted?: boolean
          content_markdown?: string
          created_at?: string
          id?: string
          job_id?: string | null
          relevance_score?: number
          resume_experience_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_experience_variants_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_shares: {
        Row: {
          access_level: string
          created_at: string | null
          expires_at: string | null
          id: string
          resume_id: string
          share_token: string
          shared_with_email: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_level?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          resume_id: string
          share_token: string
          shared_with_email: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_level?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          resume_id?: string
          share_token?: string
          shared_with_email?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      resume_shares_v2: {
        Row: {
          can_comment: boolean
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          resume_id: string
          share_token: string
          user_id: string
        }
        Insert: {
          can_comment?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          resume_id: string
          share_token: string
          user_id: string
        }
        Update: {
          can_comment?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          resume_id?: string
          share_token?: string
          user_id?: string
        }
        Relationships: []
      }
      resume_templates: {
        Row: {
          content_markdown: string
          created_at: string
          id: string
          is_default: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content_markdown: string
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content_markdown?: string
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resumes: {
        Row: {
          ai_generated: Json | null
          created_at: string | null
          id: string
          is_archived: boolean | null
          is_default: boolean | null
          last_used: string | null
          linked_jobs: Json | null
          sections: Json | null
          styling: Json | null
          success_rate: number | null
          template: string | null
          times_used: number | null
          title: string
          updated_at: string | null
          user_id: string
          versions: Json | null
        }
        Insert: {
          ai_generated?: Json | null
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_default?: boolean | null
          last_used?: string | null
          linked_jobs?: Json | null
          sections?: Json | null
          styling?: Json | null
          success_rate?: number | null
          template?: string | null
          times_used?: number | null
          title: string
          updated_at?: string | null
          user_id: string
          versions?: Json | null
        }
        Update: {
          ai_generated?: Json | null
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_default?: boolean | null
          last_used?: string | null
          linked_jobs?: Json | null
          sections?: Json | null
          styling?: Json | null
          success_rate?: number | null
          template?: string | null
          times_used?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
          versions?: Json | null
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          created_at: string
          filters: Json
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          filters?: Json
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          filters?: Json
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      technical_challenges: {
        Row: {
          best_practices: string | null
          category: string
          created_at: string
          difficulty: string
          hints: Json | null
          id: string
          problem_statement: string
          solution_framework: string | null
          tech_stack: string[]
          title: string
          updated_at: string
        }
        Insert: {
          best_practices?: string | null
          category: string
          created_at?: string
          difficulty: string
          hints?: Json | null
          id?: string
          problem_statement: string
          solution_framework?: string | null
          tech_stack?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          best_practices?: string | null
          category?: string
          created_at?: string
          difficulty?: string
          hints?: Json | null
          id?: string
          problem_statement?: string
          solution_framework?: string | null
          tech_stack?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      technical_practice_attempts: {
        Row: {
          challenge_id: string
          created_at: string
          id: string
          language: string
          notes: string | null
          rubric_checklist: Json
          solution_code: string | null
          started_at: string
          status: string
          submitted_at: string | null
          time_taken: number | null
          timer_duration: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          created_at?: string
          id?: string
          language?: string
          notes?: string | null
          rubric_checklist?: Json
          solution_code?: string | null
          started_at?: string
          status?: string
          submitted_at?: string | null
          time_taken?: number | null
          timer_duration?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          created_at?: string
          id?: string
          language?: string
          notes?: string | null
          rubric_checklist?: Json
          solution_code?: string | null
          started_at?: string
          status?: string
          submitted_at?: string | null
          time_taken?: number | null
          timer_duration?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "technical_practice_attempts_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "technical_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
