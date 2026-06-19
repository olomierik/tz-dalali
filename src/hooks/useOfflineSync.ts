import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface QueuedAction {
  id: string
  table: string
  operation: 'insert' | 'update' | 'delete'
  payload: Record<string, unknown>
  timestamp: number
}

const QUEUE_KEY = 'shule_offline_queue'

function loadQueue(): QueuedAction[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveQueue(queue: QueuedAction[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isSyncing, setIsSyncing] = useState(false)
  const [queueLength, setQueueLength] = useState(() => loadQueue().length)

  const syncQueue = useCallback(async () => {
    const queue = loadQueue()
    if (queue.length === 0) return

    setIsSyncing(true)
    const remaining: QueuedAction[] = []

    for (const action of queue) {
      try {
        if (action.operation === 'insert') {
          await (supabase as any).from(action.table).insert(action.payload)
        } else if (action.operation === 'update') {
          const { id, ...rest } = action.payload as { id: string; [k: string]: unknown }
          await (supabase as any).from(action.table).update(rest).eq('id', id)
        } else if (action.operation === 'delete') {
          await (supabase as any).from(action.table).delete().eq('id', action.payload.id)
        }
      } catch {
        remaining.push(action)
      }
    }

    saveQueue(remaining)
    setQueueLength(remaining.length)
    setIsSyncing(false)
  }, [])

  useEffect(() => {
    const onOnline = () => {
      setIsOnline(true)
      syncQueue()
    }
    const onOffline = () => setIsOnline(false)

    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [syncQueue])

  const enqueue = useCallback((action: Omit<QueuedAction, 'id' | 'timestamp'>) => {
    const queue = loadQueue()
    queue.push({ ...action, id: crypto.randomUUID(), timestamp: Date.now() })
    saveQueue(queue)
    setQueueLength(queue.length)
  }, [])

  return { isOnline, isSyncing, queueLength, enqueue, syncQueue }
}
