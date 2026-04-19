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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      countries: {
        Row: {
          capital_gains_rate: number | null
          continent: string | null
          created_at: string | null
          currency_code: string | null
          currency_name: string | null
          currency_symbol: string | null
          flag_emoji: string | null
          id: string
          is_active: boolean | null
          iso_code: string
          iso3_code: string | null
          language_primary: string | null
          name: string
          phone_code: string | null
          property_tax_rate: number | null
          stamp_duty_rate: number | null
          tzdalali_active: boolean | null
          tzdalali_launch_date: string | null
          updated_at: string | null
        }
        Insert: {
          capital_gains_rate?: number | null
          continent?: string | null
          created_at?: string | null
          currency_code?: string | null
          currency_name?: string | null
          currency_symbol?: string | null
          flag_emoji?: string | null
          id?: string
          is_active?: boolean | null
          iso_code: string
          iso3_code?: string | null
          language_primary?: string | null
          name: string
          phone_code?: string | null
          property_tax_rate?: number | null
          stamp_duty_rate?: number | null
          tzdalali_active?: boolean | null
          tzdalali_launch_date?: string | null
          updated_at?: string | null
        }
        Update: {
          capital_gains_rate?: number | null
          continent?: string | null
          created_at?: string | null
          currency_code?: string | null
          currency_name?: string | null
          currency_symbol?: string | null
          flag_emoji?: string | null
          id?: string
          is_active?: boolean | null
          iso_code?: string
          iso3_code?: string | null
          language_primary?: string | null
          name?: string
          phone_code?: string | null
          property_tax_rate?: number | null
          stamp_duty_rate?: number | null
          tzdalali_active?: boolean | null
          tzdalali_launch_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      districts: {
        Row: {
          council_type: string | null
          country_id: string | null
          created_at: string | null
          headquarters: string | null
          id: string
          is_active: boolean | null
          local_name: string | null
          name: string
          region_id: string | null
          updated_at: string | null
        }
        Insert: {
          council_type?: string | null
          country_id?: string | null
          created_at?: string | null
          headquarters?: string | null
          id?: string
          is_active?: boolean | null
          local_name?: string | null
          name: string
          region_id?: string | null
          updated_at?: string | null
        }
        Update: {
          council_type?: string | null
          country_id?: string | null
          created_at?: string | null
          headquarters?: string | null
          id?: string
          is_active?: boolean | null
          local_name?: string | null
          name?: string
          region_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "districts_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "districts_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          doc_type: Database["public"]["Enums"]["doc_type"]
          file_size: number | null
          file_url: string
          id: string
          name: string | null
          partner_id: string | null
          property_id: string | null
          signed: boolean | null
          signed_at: string | null
          transaction_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          doc_type: Database["public"]["Enums"]["doc_type"]
          file_size?: number | null
          file_url: string
          id?: string
          name?: string | null
          partner_id?: string | null
          property_id?: string | null
          signed?: boolean | null
          signed_at?: string | null
          transaction_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          doc_type?: Database["public"]["Enums"]["doc_type"]
          file_size?: number | null
          file_url?: string
          id?: string
          name?: string | null
          partner_id?: string | null
          property_id?: string | null
          signed?: boolean | null
          signed_at?: string | null
          transaction_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_rates: {
        Row: {
          base_currency: string | null
          id: string
          rate: number
          target_currency: string
          updated_at: string | null
        }
        Insert: {
          base_currency?: string | null
          id?: string
          rate: number
          target_currency: string
          updated_at?: string | null
        }
        Update: {
          base_currency?: string | null
          id?: string
          rate?: number
          target_currency?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          body: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          metadata: Json | null
          notification_type: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          notification_type?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          notification_type?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_payouts: {
        Row: {
          amount_usd: number
          created_at: string | null
          currency: string | null
          id: string
          partner_id: string | null
          payment_ref: string | null
          payout_type: string | null
          processed_at: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          transaction_id: string | null
        }
        Insert: {
          amount_usd: number
          created_at?: string | null
          currency?: string | null
          id?: string
          partner_id?: string | null
          payment_ref?: string | null
          payout_type?: string | null
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
        }
        Update: {
          amount_usd?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          partner_id?: string | null
          payment_ref?: string | null
          payout_type?: string | null
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_payouts_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_payouts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          auto_assign: boolean | null
          bar_registration_number: string | null
          commission_rate_law: number | null
          commission_rate_tax: number | null
          countries_covered: Json | null
          created_at: string | null
          description: string | null
          firm_name: string
          id: string
          logo_url: string | null
          office_address: string | null
          partner_type: Database["public"]["Enums"]["partner_type"]
          primary_country_id: string | null
          rating: number | null
          status: Database["public"]["Enums"]["partner_status"] | null
          tax_registration_number: string | null
          tier: Database["public"]["Enums"]["partner_tier"] | null
          total_deals: number | null
          total_revenue: number | null
          tzdalali_verified_badge: boolean | null
          updated_at: string | null
          user_id: string | null
          website: string | null
          years_in_operation: number | null
        }
        Insert: {
          auto_assign?: boolean | null
          bar_registration_number?: string | null
          commission_rate_law?: number | null
          commission_rate_tax?: number | null
          countries_covered?: Json | null
          created_at?: string | null
          description?: string | null
          firm_name: string
          id?: string
          logo_url?: string | null
          office_address?: string | null
          partner_type: Database["public"]["Enums"]["partner_type"]
          primary_country_id?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["partner_status"] | null
          tax_registration_number?: string | null
          tier?: Database["public"]["Enums"]["partner_tier"] | null
          total_deals?: number | null
          total_revenue?: number | null
          tzdalali_verified_badge?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          years_in_operation?: number | null
        }
        Update: {
          auto_assign?: boolean | null
          bar_registration_number?: string | null
          commission_rate_law?: number | null
          commission_rate_tax?: number | null
          countries_covered?: Json | null
          created_at?: string | null
          description?: string | null
          firm_name?: string
          id?: string
          logo_url?: string | null
          office_address?: string | null
          partner_type?: Database["public"]["Enums"]["partner_type"]
          primary_country_id?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["partner_status"] | null
          tax_registration_number?: string | null
          tier?: Database["public"]["Enums"]["partner_tier"] | null
          total_deals?: number | null
          total_revenue?: number | null
          tzdalali_verified_badge?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          years_in_operation?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "partners_primary_country_id_fkey"
            columns: ["primary_country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          amount_usd: number | null
          created_at: string | null
          currency: string
          external_ref: string | null
          id: string
          metadata: Json | null
          method: Database["public"]["Enums"]["payment_method"] | null
          payment_type: string
          property_id: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          amount_usd?: number | null
          created_at?: string | null
          currency: string
          external_ref?: string | null
          id?: string
          metadata?: Json | null
          method?: Database["public"]["Enums"]["payment_method"] | null
          payment_type: string
          property_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          amount_usd?: number | null
          created_at?: string | null
          currency?: string
          external_ref?: string | null
          id?: string
          metadata?: Json | null
          method?: Database["public"]["Enums"]["payment_method"] | null
          payment_type?: string
          property_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          admin_notes: string | null
          amenities: Json | null
          bathrooms: number | null
          bedrooms: number | null
          country_id: string | null
          created_at: string | null
          deal_type: Database["public"]["Enums"]["deal_type_en"]
          description: string | null
          district_id: string | null
          featured_image: string | null
          features: Json | null
          full_address: string | null
          id: string
          images: Json | null
          is_featured: boolean | null
          is_verified: boolean | null
          latitude: number | null
          listing_fee_paid: boolean | null
          longitude: number | null
          neighborhood: string | null
          price: number
          price_currency: string | null
          price_negotiable: boolean | null
          price_usd: number | null
          property_type: Database["public"]["Enums"]["property_type_en"]
          region_id: string | null
          rejection_reason: string | null
          rent_period: string | null
          saves: number | null
          seller_id: string | null
          size_sqm: number | null
          status: string
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          admin_notes?: string | null
          amenities?: Json | null
          bathrooms?: number | null
          bedrooms?: number | null
          country_id?: string | null
          created_at?: string | null
          deal_type: Database["public"]["Enums"]["deal_type_en"]
          description?: string | null
          district_id?: string | null
          featured_image?: string | null
          features?: Json | null
          full_address?: string | null
          id?: string
          images?: Json | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          listing_fee_paid?: boolean | null
          longitude?: number | null
          neighborhood?: string | null
          price: number
          price_currency?: string | null
          price_negotiable?: boolean | null
          price_usd?: number | null
          property_type: Database["public"]["Enums"]["property_type_en"]
          region_id?: string | null
          rejection_reason?: string | null
          rent_period?: string | null
          saves?: number | null
          seller_id?: string | null
          size_sqm?: number | null
          status?: string
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          admin_notes?: string | null
          amenities?: Json | null
          bathrooms?: number | null
          bedrooms?: number | null
          country_id?: string | null
          created_at?: string | null
          deal_type?: Database["public"]["Enums"]["deal_type_en"]
          description?: string | null
          district_id?: string | null
          featured_image?: string | null
          features?: Json | null
          full_address?: string | null
          id?: string
          images?: Json | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          listing_fee_paid?: boolean | null
          longitude?: number | null
          neighborhood?: string | null
          price?: number
          price_currency?: string | null
          price_negotiable?: boolean | null
          price_usd?: number | null
          property_type?: Database["public"]["Enums"]["property_type_en"]
          region_id?: string | null
          rejection_reason?: string | null
          rent_period?: string | null
          saves?: number | null
          seller_id?: string | null
          size_sqm?: number | null
          status?: string
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          capital: string | null
          code: string | null
          country_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          local_name: string | null
          name: string
          updated_at: string | null
          zone: Database["public"]["Enums"]["zone_type"] | null
        }
        Insert: {
          capital?: string | null
          code?: string | null
          country_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          local_name?: string | null
          name: string
          updated_at?: string | null
          zone?: Database["public"]["Enums"]["zone_type"] | null
        }
        Update: {
          capital?: string | null
          code?: string | null
          country_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          local_name?: string | null
          name?: string
          updated_at?: string | null
          zone?: Database["public"]["Enums"]["zone_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "regions_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          is_public: boolean | null
          rating: number | null
          reviewee_id: string | null
          reviewee_partner_id: string | null
          reviewer_id: string | null
          transaction_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          rating?: number | null
          reviewee_id?: string | null
          reviewee_partner_id?: string | null
          reviewer_id?: string | null
          transaction_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          rating?: number | null
          reviewee_id?: string | null
          reviewee_partner_id?: string | null
          reviewer_id?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_partner_id_fkey"
            columns: ["reviewee_partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_properties: {
        Row: {
          created_at: string | null
          id: string
          property_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_properties_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      search_alerts: {
        Row: {
          bedrooms_min: number | null
          country_id: string | null
          created_at: string | null
          deal_type: Database["public"]["Enums"]["deal_type_en"] | null
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          name: string | null
          price_max: number | null
          price_min: number | null
          property_type: Database["public"]["Enums"]["property_type_en"] | null
          region_id: string | null
          user_id: string | null
        }
        Insert: {
          bedrooms_min?: number | null
          country_id?: string | null
          created_at?: string | null
          deal_type?: Database["public"]["Enums"]["deal_type_en"] | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          name?: string | null
          price_max?: number | null
          price_min?: number | null
          property_type?: Database["public"]["Enums"]["property_type_en"] | null
          region_id?: string | null
          user_id?: string | null
        }
        Update: {
          bedrooms_min?: number | null
          country_id?: string | null
          created_at?: string | null
          deal_type?: Database["public"]["Enums"]["deal_type_en"] | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          name?: string | null
          price_max?: number | null
          price_min?: number | null
          property_type?: Database["public"]["Enums"]["property_type_en"] | null
          region_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_alerts_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "search_alerts_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "search_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_steps: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          documents: Json | null
          due_date: string | null
          id: string
          notes: string | null
          status: string | null
          step_description: string | null
          step_name: string
          step_number: number
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          documents?: Json | null
          due_date?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          step_description?: string | null
          step_name: string
          step_number: number
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          documents?: Json | null
          due_date?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          step_description?: string | null
          step_name?: string
          step_number?: number
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_steps_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_steps_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_steps_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          admin_notes: string | null
          agent_commission_pct: number | null
          agreed_price: number
          agreed_price_usd: number | null
          buyer_id: string | null
          cancelled_at: string | null
          cancelled_reason: string | null
          completed_at: string | null
          created_at: string | null
          currency: string | null
          current_step: number | null
          deal_type: Database["public"]["Enums"]["deal_type_en"]
          dispute_reason: string | null
          escrow_funded_at: string | null
          escrow_status: Database["public"]["Enums"]["escrow_status"] | null
          id: string
          law_firm_fee_pct: number | null
          law_firm_id: string | null
          notes: string | null
          platform_fee_pct: number | null
          property_id: string | null
          reference_code: string | null
          seller_id: string | null
          status: string
          tax_consultant_id: string | null
          tax_fee_pct: number | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          agent_commission_pct?: number | null
          agreed_price: number
          agreed_price_usd?: number | null
          buyer_id?: string | null
          cancelled_at?: string | null
          cancelled_reason?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          current_step?: number | null
          deal_type: Database["public"]["Enums"]["deal_type_en"]
          dispute_reason?: string | null
          escrow_funded_at?: string | null
          escrow_status?: Database["public"]["Enums"]["escrow_status"] | null
          id?: string
          law_firm_fee_pct?: number | null
          law_firm_id?: string | null
          notes?: string | null
          platform_fee_pct?: number | null
          property_id?: string | null
          reference_code?: string | null
          seller_id?: string | null
          status?: string
          tax_consultant_id?: string | null
          tax_fee_pct?: number | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          agent_commission_pct?: number | null
          agreed_price?: number
          agreed_price_usd?: number | null
          buyer_id?: string | null
          cancelled_at?: string | null
          cancelled_reason?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          current_step?: number | null
          deal_type?: Database["public"]["Enums"]["deal_type_en"]
          dispute_reason?: string | null
          escrow_funded_at?: string | null
          escrow_status?: Database["public"]["Enums"]["escrow_status"] | null
          id?: string
          law_firm_fee_pct?: number | null
          law_firm_id?: string | null
          notes?: string | null
          platform_fee_pct?: number | null
          property_id?: string | null
          reference_code?: string | null
          seller_id?: string | null
          status?: string
          tax_consultant_id?: string | null
          tax_fee_pct?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_law_firm_id_fkey"
            columns: ["law_firm_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_tax_consultant_id_fkey"
            columns: ["tax_consultant_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          country_id: string | null
          created_at: string | null
          display_name: string | null
          district_id: string | null
          email: string
          full_name: string | null
          id: string
          id_verification_ref: string | null
          id_verification_status:
            | Database["public"]["Enums"]["id_verification_status"]
            | null
          is_active: boolean | null
          last_login: string | null
          phone: string | null
          phone_verified: boolean | null
          preferred_currency: string | null
          preferred_language: string | null
          region_id: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          total_deals: number | null
          total_spent: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          country_id?: string | null
          created_at?: string | null
          display_name?: string | null
          district_id?: string | null
          email: string
          full_name?: string | null
          id: string
          id_verification_ref?: string | null
          id_verification_status?:
            | Database["public"]["Enums"]["id_verification_status"]
            | null
          is_active?: boolean | null
          last_login?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          preferred_currency?: string | null
          preferred_language?: string | null
          region_id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          total_deals?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          country_id?: string | null
          created_at?: string | null
          display_name?: string | null
          district_id?: string | null
          email?: string
          full_name?: string | null
          id?: string
          id_verification_ref?: string | null
          id_verification_status?:
            | Database["public"]["Enums"]["id_verification_status"]
            | null
          is_active?: boolean | null
          last_login?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          preferred_currency?: string | null
          preferred_language?: string | null
          region_id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          total_deals?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      platform_stats: {
        Row: {
          active_transactions: number | null
          completed_transactions: number | null
          pending_listings: number | null
          pending_verifications: number | null
          total_properties: number | null
          total_revenue: number | null
          total_transactions: number | null
          total_users: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      deal_type_en: "sale" | "rent" | "lease"
      doc_type:
        | "title_deed"
        | "sale_agreement"
        | "tax_clearance"
        | "id_copy"
        | "survey_report"
        | "valuation_report"
        | "legal_guarantee"
        | "other"
      escrow_status: "pending" | "funded" | "held" | "released" | "refunded"
      id_verification_status: "pending" | "submitted" | "verified" | "rejected"
      notification_type_en:
        | "deal_update"
        | "listing_approved"
        | "payment_confirmed"
        | "document_uploaded"
        | "partner_assigned"
        | "message"
        | "system"
        | "marketing"
      partner_status: "pending" | "active" | "suspended" | "rejected"
      partner_tier: "associate" | "certified" | "elite"
      partner_type: "law_firm" | "tax_consultant" | "both"
      payment_method:
        | "stripe_card"
        | "mpesa"
        | "tigopesa"
        | "airtel_money"
        | "flutterwave"
        | "bank_transfer"
        | "unionpay"
        | "other"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      property_type_en:
        | "apartment"
        | "house"
        | "villa"
        | "land"
        | "commercial"
        | "hotel"
        | "office"
        | "warehouse"
        | "other"
      user_role:
        | "buyer"
        | "seller"
        | "law_firm"
        | "tax_consultant"
        | "admin"
        | "superadmin"
      zone_type: "mainland" | "zanzibar" | "pemba" | "island" | "territory"
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
    Enums: {
      deal_type_en: ["sale", "rent", "lease"],
      doc_type: [
        "title_deed",
        "sale_agreement",
        "tax_clearance",
        "id_copy",
        "survey_report",
        "valuation_report",
        "legal_guarantee",
        "other",
      ],
      escrow_status: ["pending", "funded", "held", "released", "refunded"],
      id_verification_status: ["pending", "submitted", "verified", "rejected"],
      notification_type_en: [
        "deal_update",
        "listing_approved",
        "payment_confirmed",
        "document_uploaded",
        "partner_assigned",
        "message",
        "system",
        "marketing",
      ],
      partner_status: ["pending", "active", "suspended", "rejected"],
      partner_tier: ["associate", "certified", "elite"],
      partner_type: ["law_firm", "tax_consultant", "both"],
      payment_method: [
        "stripe_card",
        "mpesa",
        "tigopesa",
        "airtel_money",
        "flutterwave",
        "bank_transfer",
        "unionpay",
        "other",
      ],
      payment_status: ["pending", "completed", "failed", "refunded"],
      property_type_en: [
        "apartment",
        "house",
        "villa",
        "land",
        "commercial",
        "hotel",
        "office",
        "warehouse",
        "other",
      ],
      user_role: [
        "buyer",
        "seller",
        "law_firm",
        "tax_consultant",
        "admin",
        "superadmin",
      ],
      zone_type: ["mainland", "zanzibar", "pemba", "island", "territory"],
    },
  },
} as const
