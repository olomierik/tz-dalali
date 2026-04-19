import { useState } from 'react'
import { Search, Shield, ShieldCheck, ShieldX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { useAdminUsers, useAdminUpdateVerification } from '@/hooks/useAdminData'
import { ROLE_COLORS } from '@/lib/statusColors'

const VERIFICATION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  verified: ShieldCheck,
  pending: Shield,
  not_submitted: Shield,
  rejected: ShieldX,
}

const VERIFICATION_COLORS: Record<string, string> = {
  verified: 'text-green-600',
  pending: 'text-yellow-600',
  not_submitted: 'text-muted-foreground',
  rejected: 'text-red-600',
}

export default function AdminUsers() {
  const { data: users = [], isLoading } = useAdminUsers()
  const updateVerification = useAdminUpdateVerification()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const filtered = users.filter(u => {
    const matchSearch = !search
      || u.email.toLowerCase().includes(search.toLowerCase())
      || (u.full_name ?? '').toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const setVerification = (id: string, status: string) => {
    updateVerification.mutate(
      { id, status },
      {
        onSuccess: () => toast.success(`Verification status set to ${status}`),
        onError: (e: any) => toast.error(e.message),
      }
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl text-primary">Manage Users</h1>
        <p className="text-muted-foreground mt-1">View users and manage identity verifications.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or email…" className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="sm:w-40 h-9"><SelectValue placeholder="All roles" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="buyer">Buyers</SelectItem>
            <SelectItem value="seller">Sellers</SelectItem>
            <SelectItem value="law_firm">Law Firms</SelectItem>
            <SelectItem value="tax_consultant">Tax Consultants</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Deals</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No users found</TableCell>
              </TableRow>
            ) : (
              filtered.map(u => {
                const VerIcon = VERIFICATION_ICONS[u.id_verification_status] ?? Shield
                return (
                  <TableRow key={u.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{u.full_name ?? 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs capitalize ${ROLE_COLORS[u.role] ?? 'bg-muted text-muted-foreground'}`}>
                        {u.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 text-xs ${VERIFICATION_COLORS[u.id_verification_status] ?? ''}`}>
                        <VerIcon className="h-3.5 w-3.5" />
                        <span className="capitalize">{u.id_verification_status.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{u.total_deals}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {u.id_verification_status === 'pending' && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost" size="sm" className="h-7 text-xs text-green-600 hover:text-green-700"
                            onClick={() => setVerification(u.id, 'verified')} disabled={updateVerification.isPending}
                          >Approve</Button>
                          <Button
                            variant="ghost" size="sm" className="h-7 text-xs text-red-600 hover:text-red-700"
                            onClick={() => setVerification(u.id, 'rejected')} disabled={updateVerification.isPending}
                          >Reject</Button>
                        </div>
                      )}
                      {u.id_verification_status === 'not_submitted' && (
                        <span className="text-xs text-muted-foreground">No docs</span>
                      )}
                      {u.id_verification_status === 'verified' && (
                        <span className="text-xs text-green-600">Verified ✓</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
