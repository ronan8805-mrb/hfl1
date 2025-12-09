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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          username: string | null
          avatar_url: string | null
          role: 'user' | 'instructor' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
          role?: 'user' | 'instructor' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
          role?: 'user' | 'instructor' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          price: number
          currency: string
          thumbnail_url: string
          video_preview_url: string | null
          instructor_id: string
          category: string
          level: string
          duration_minutes: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          price: number
          currency?: string
          thumbnail_url: string
          video_preview_url?: string | null
          instructor_id: string
          category: string
          level: string
          duration_minutes: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          price?: number
          currency?: string
          thumbnail_url?: string
          video_preview_url?: string | null
          instructor_id?: string
          category?: string
          level?: string
          duration_minutes?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      course_lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          video_url: string
          duration_seconds: number
          order: number
          is_free: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          video_url: string
          duration_seconds: number
          order: number
          is_free?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          video_url?: string
          duration_seconds?: number
          order?: number
          is_free?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      course_tests: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          passing_grade: number
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          passing_grade?: number
          order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          passing_grade?: number
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      test_questions: {
        Row: {
          id: string
          test_id: string
          question: string
          question_type: 'multiple_choice' | 'true_false' | 'short_answer'
          order: number
          points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          test_id: string
          question: string
          question_type: 'multiple_choice' | 'true_false' | 'short_answer'
          order: number
          points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          test_id?: string
          question?: string
          question_type?: 'multiple_choice' | 'true_false' | 'short_answer'
          order?: number
          points?: number
          created_at?: string
          updated_at?: string
        }
      }
      test_question_options: {
        Row: {
          id: string
          question_id: string
          option_text: string
          is_correct: boolean
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          question_id: string
          option_text: string
          is_correct?: boolean
          order: number
          created_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          option_text?: string
          is_correct?: boolean
          order?: number
          created_at?: string
        }
      }
      test_question_answers: {
        Row: {
          id: string
          question_id: string
          answer_text: string
          is_case_sensitive: boolean
          created_at: string
        }
        Insert: {
          id?: string
          question_id: string
          answer_text: string
          is_case_sensitive?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          answer_text?: string
          is_case_sensitive?: boolean
          created_at?: string
        }
      }
      user_test_attempts: {
        Row: {
          id: string
          user_id: string
          test_id: string
          score: number
          total_points: number
          percentage: number
          passed: boolean
          answers: Json
          started_at: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          test_id: string
          score: number
          total_points: number
          percentage: number
          passed: boolean
          answers: Json
          started_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          test_id?: string
          score?: number
          total_points?: number
          percentage?: number
          passed?: boolean
          answers?: Json
          started_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          course_id: string
          revolut_order_id: string
          amount: number
          currency: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          revolut_order_id: string
          amount: number
          currency: string
          status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          revolut_order_id?: string
          amount?: number
          currency?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          progress_seconds: number
          last_watched_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed?: boolean
          progress_seconds?: number
          last_watched_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed?: boolean
          progress_seconds?: number
          last_watched_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      community_posts: {
        Row: {
          id: string
          user_id: string
          content: string
          media_url: string | null
          media_type: string | null
          upvotes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          media_url?: string | null
          media_type?: string | null
          upvotes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          media_url?: string | null
          media_type?: string | null
          upvotes?: number
          created_at?: string
          updated_at?: string
        }
      }
      community_comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          content: string
          media_url: string | null
          media_type: string | null
          read: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          content: string
          media_url?: string | null
          media_type?: string | null
          read?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          content?: string
          media_url?: string | null
          media_type?: string | null
          read?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

