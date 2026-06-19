import { useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useOfflineSync } from './useOfflineSync'

interface LogActionParams {
  action: string
  entityType: string
  entityId?: string
  details?: Record<string, unknown>
}

export function useAuditLog() {
  const { schoolId, user } = useAuth()
  const { isOnline, enqueue } = useOfflineSync()

  const logAction = useCallback(async ({ action, entityType, entityId, details = {} }: LogActionParams) => {
    if (!schoolId) return

    const entry = {
      school_id: schoolId,
      actor_id: user?.id ?? null,
      action,
      entity_type: entityType,
      entity_id: entityId ?? null,
      details,
    }

    if (isOnline) {
      await supabase.from('audit_logs').insert(entry)
    } else {
      enqueue({ table: 'audit_logs', operation: 'insert', payload: entry })
    }
  }, [schoolId, user, isOnline, enqueue])

  return { logAction }
}
