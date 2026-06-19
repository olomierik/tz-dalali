import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { format, isToday, isYesterday } from 'date-fns'
import { MessageSquare, Plus, Send, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'

interface Conversation {
  id: string
  subject: string | null
  updated_at: string
  participants: Array<{ profile_id: string; profile: { full_name: string; role: UserRole } | null }>
  lastMessage?: { body: string; sent_at: string }
}

interface Message {
  id: string
  body: string
  sent_at: string
  sender_id: string
  sender: { full_name: string } | null
}

interface ContactOption { id: string; full_name: string; role: UserRole }

export default function MessagesPage() {
  const { t } = useTranslation()
  const { profile, schoolId, canMessage } = useAuth()

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMsg, setNewMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [contacts, setContacts] = useState<ContactOption[]>([])
  const [newForm, setNewForm] = useState({ recipient_id: '', subject: '', body: '' })
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (schoolId) { loadConversations(); loadContacts() } }, [schoolId])

  useEffect(() => {
    if (!activeConvId) return
    loadMessages(activeConvId)
    const channel = supabase.channel(`conv:${activeConvId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeConvId}` }, () => loadMessages(activeConvId))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [activeConvId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const loadConversations = async () => {
    const { data } = await supabase
      .from('conversations')
      .select(`id, subject, updated_at, participants:conversation_participants(profile_id, profile:profile_id(full_name, role))`)
      .eq('school_id', schoolId!)
      .order('updated_at', { ascending: false })
    setConversations((data ?? []) as unknown as Conversation[])
    setLoading(false)
  }

  const loadContacts = async () => {
    const { data } = await supabase.from('profiles').select('id, full_name, role').eq('school_id', schoolId!).neq('id', profile!.id)
    const filtered = ((data ?? []) as ContactOption[]).filter(c => canMessage(c.role))
    setContacts(filtered)
  }

  const loadMessages = async (convId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('id, body, sent_at, sender_id, sender:sender_id(full_name)')
      .eq('conversation_id', convId)
      .order('sent_at')
    setMessages((data ?? []) as unknown as Message[])
    // Mark as read
    await supabase.from('conversation_participants').update({ last_read_at: new Date().toISOString() }).eq('conversation_id', convId).eq('profile_id', profile!.id)
  }

  const handleSend = async () => {
    if (!newMsg.trim() || !activeConvId) return
    setSending(true)
    await supabase.from('messages').insert({ conversation_id: activeConvId, sender_id: profile!.id, body: newMsg.trim() })
    await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', activeConvId)
    setNewMsg('')
    setSending(false)
  }

  const handleNewConversation = async () => {
    if (!newForm.recipient_id || !newForm.body.trim()) return
    setSending(true)

    // Check firewall
    const recipient = contacts.find(c => c.id === newForm.recipient_id)
    if (!recipient || !canMessage(recipient.role)) {
      setSending(false)
      return
    }

    const { data: conv } = await supabase.from('conversations').insert({ school_id: schoolId!, subject: newForm.subject || null }).select().single()
    if (!conv) { setSending(false); return }

    await supabase.from('conversation_participants').insert([
      { conversation_id: conv.id, profile_id: profile!.id },
      { conversation_id: conv.id, profile_id: newForm.recipient_id },
    ])
    await supabase.from('messages').insert({ conversation_id: conv.id, sender_id: profile!.id, body: newForm.body.trim() })
    await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conv.id)

    setNewForm({ recipient_id: '', subject: '', body: '' })
    setShowNew(false)
    setSending(false)
    await loadConversations()
    setActiveConvId(conv.id)
  }

  const getConvLabel = (conv: Conversation) => {
    const others = conv.participants.filter(p => p.profile_id !== profile?.id)
    return others.map(p => p.profile?.full_name ?? '?').join(', ')
  }

  const msgDateLabel = (date: string) => {
    const d = new Date(date)
    if (isToday(d)) return format(d, 'HH:mm')
    if (isYesterday(d)) return t('messages.yesterday')
    return format(d, 'd MMM')
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <div className={cn('w-full md:w-72 border-r border-gray-200 bg-white flex flex-col', activeConvId && 'hidden md:flex')}>
        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
          <h1 className="font-bold text-gray-900 flex items-center gap-2 text-sm"><MessageSquare className="h-4 w-4 text-blue-700" />{t('messages.title')}</h1>
          {contacts.length > 0 && (
            <Button size="sm" variant="outline" onClick={() => setShowNew(true)} className="h-7 text-xs gap-1"><Plus className="h-3 w-3" />{t('messages.newMessage')}</Button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? <div className="p-3 space-y-2">{[1,2,3].map(i => <div key={i} className="h-14 bg-gray-100 rounded animate-pulse" />)}</div>
            : conversations.length === 0 ? <p className="text-center text-gray-400 text-sm py-8">{t('messages.noConversations')}</p>
            : conversations.map(conv => (
              <button key={conv.id} onClick={() => setActiveConvId(conv.id)} className={cn('w-full text-left p-3 hover:bg-gray-50 border-b border-gray-50 transition-colors', activeConvId === conv.id && 'bg-blue-50')}>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">{getConvLabel(conv).charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">{getConvLabel(conv)}</p>
                      <span className="text-xs text-gray-400 shrink-0 ml-1">{msgDateLabel(conv.updated_at)}</span>
                    </div>
                    {conv.subject && <p className="text-xs text-gray-500 truncate">{conv.subject}</p>}
                  </div>
                </div>
              </button>
            ))
          }
        </div>
      </div>

      {/* Chat area */}
      <div className={cn('flex-1 flex flex-col bg-gray-50', !activeConvId && 'hidden md:flex')}>
        {!activeConvId ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">{t('messages.selectConversation')}</div>
        ) : (
          <>
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
              <button onClick={() => setActiveConvId(null)} className="md:hidden text-gray-500">←</button>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                  {getConvLabel(conversations.find(c => c.id === activeConvId)!).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="font-medium text-sm text-gray-900">{getConvLabel(conversations.find(c => c.id === activeConvId)!)}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? <p className="text-center text-gray-400 text-sm">{t('messages.noMessages')}</p>
                : messages.map(m => {
                  const mine = m.sender_id === profile?.id
                  return (
                    <div key={m.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                      <div className={cn('max-w-xs md:max-w-sm rounded-2xl px-3 py-2 text-sm', mine ? 'bg-blue-700 text-white rounded-br-sm' : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm')}>
                        {!mine && <p className="text-xs font-medium mb-0.5 text-blue-600">{m.sender?.full_name}</p>}
                        <p className="leading-relaxed">{m.body}</p>
                        <p className={cn('text-xs mt-0.5 text-right', mine ? 'text-blue-200' : 'text-gray-400')}>{format(new Date(m.sent_at), 'HH:mm')}</p>
                      </div>
                    </div>
                  )
                })}
              <div ref={bottomRef} />
            </div>
            <div className="bg-white border-t border-gray-200 p-3 flex gap-2">
              <Input value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder={t('messages.typeMessage')} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()} className="flex-1" />
              <Button onClick={handleSend} disabled={!newMsg.trim() || sending} size="icon" className="bg-blue-700 hover:bg-blue-800"><Send className="h-4 w-4" /></Button>
            </div>
          </>
        )}
      </div>

      {/* New message dialog */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{t('messages.newMessage')}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>{t('messages.to')}</Label>
              <Select value={newForm.recipient_id} onValueChange={v => setNewForm(f => ({ ...f, recipient_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select recipient" /></SelectTrigger>
                <SelectContent>
                  {contacts.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.full_name} <span className="text-gray-400 text-xs ml-1">({c.role})</span></SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {contacts.length === 0 && <p className="text-xs text-amber-600 flex items-center gap-1 mt-1"><Lock className="h-3 w-3" />{t('messages.blocked')}</p>}
            </div>
            <div><Label>{t('messages.subject')}</Label><Input value={newForm.subject} onChange={e => setNewForm(f => ({ ...f, subject: e.target.value }))} /></div>
            <div><Label>{t('messages.typeMessage')}</Label><Input value={newForm.body} onChange={e => setNewForm(f => ({ ...f, body: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNew(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleNewConversation} disabled={!newForm.recipient_id || !newForm.body || sending} className="bg-blue-700 hover:bg-blue-800">{sending ? t('common.loading') : t('messages.send')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
