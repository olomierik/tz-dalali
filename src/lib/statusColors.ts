export const TRANSACTION_STATUS_COLORS: Record<string, string> = {
  initiated: 'bg-blue-100 text-blue-700 border-blue-200',
  fee_paid: 'bg-blue-100 text-blue-700 border-blue-200',
  partner_assigned: 'bg-purple-100 text-purple-700 border-purple-200',
  due_diligence: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  contract_prep: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  tax_clearance: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  signing: 'bg-orange-100 text-orange-700 border-orange-200',
  escrow_funded: 'bg-orange-100 text-orange-700 border-orange-200',
  title_transfer: 'bg-orange-100 text-orange-700 border-orange-200',
  transferred: 'bg-green-100 text-green-700 border-green-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  disputed: 'bg-red-100 text-red-700 border-red-200',
}

export const PROPERTY_STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700 border-green-200',
  draft: 'bg-muted text-muted-foreground border-border',
  under_offer: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  sold: 'bg-blue-100 text-blue-700 border-blue-200',
  rented: 'bg-blue-100 text-blue-700 border-blue-200',
  inactive: 'bg-red-100 text-red-700 border-red-200',
}

export const PAYOUT_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  processing: 'bg-blue-100 text-blue-700 border-blue-200',
  paid: 'bg-green-100 text-green-700 border-green-200',
  failed: 'bg-red-100 text-red-700 border-red-200',
}

export const ROLE_COLORS: Record<string, string> = {
  buyer: 'bg-blue-100 text-blue-700 border-blue-200',
  seller: 'bg-purple-100 text-purple-700 border-purple-200',
  law_firm: 'bg-green-100 text-green-700 border-green-200',
  tax_consultant: 'bg-green-100 text-green-700 border-green-200',
  admin: 'bg-amber-100 text-amber-800 border-amber-200',
}

export const ACTIVE_TX_STATUSES = [
  'initiated', 'fee_paid', 'partner_assigned', 'due_diligence',
  'contract_prep', 'tax_clearance', 'signing', 'escrow_funded', 'title_transfer',
]

export const PROPERTY_TYPES = [
  'house', 'apartment', 'villa', 'land', 'commercial', 'office', 'warehouse', 'hotel', 'other',
] as const

export const DEAL_TYPES = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
  { value: 'lease', label: 'For Lease' },
] as const

export const CURRENCIES = ['USD', 'TZS', 'KES', 'GBP', 'EUR', 'AED', 'ZAR', 'NGN', 'GHS', 'XOF'] as const
