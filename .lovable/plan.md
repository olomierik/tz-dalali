
# tzdalali.com — Luxury Real Estate Brokerage Platform

A premium, English-only real estate platform with full Supabase backend (Lovable Cloud). Dark navy + gold luxury aesthetic with serif headings.

## User Roles
- **Visitor** — browse, search, contact (no account)
- **Buyer/Renter** — saves favorites & searches, books viewings, submits offers, messages agents
- **Agent** — manages listings, leads, viewings, offers, deals, documents, commissions
- **Admin** — approves listings/agents, manages users, oversees all deals, site settings

## Public Site
- **Home** — hero search (location, type, sale/rent, price), featured luxury listings, browse by category, agent showcase
- **Search & Listings** — filters (sale/rent/commercial, price range, beds/baths, area, amenities), grid/map toggle, saved-search alerts
- **Property Detail** — photo gallery, interactive map, floor plan, full amenity list, agent card, "Request Viewing" / "Make an Offer" / "Contact Agent" actions, similar listings
- **Agent Directory & Profile** — browse agents, see their active listings & reviews
- **About / Contact**

## Buyer Dashboard
- Saved properties & saved searches with email alerts
- My viewings (upcoming/past)
- My offers (status: pending/countered/accepted/rejected)
- Messages with agents
- Documents shared with me

## Agent Dashboard
- **Listings manager** — create/edit listings (sale, rent, commercial), upload photos & floor plans, set location on map, amenities, status (draft/pending/published/sold/rented)
- **Leads inbox** — inquiries, messages
- **Viewings calendar** — set availability, accept/decline bookings
- **Offers** — receive, counter, accept, reject
- **Deal pipeline** — Kanban: Lead → Viewing → Offer → Under Contract → Closed (drag cards between stages)
- **Documents** — per-deal folder, upload contracts, IDs, proof of funds
- **Commissions** — auto-calculated per closed deal (rate %, payout status)

## Admin Dashboard
- Approve new agents & new listings
- Manage all users, listings, deals
- Site-wide analytics (views, leads, conversions, commission totals)
- Featured listings curation

## Backend (Lovable Cloud / Supabase)
- **Auth**: email/password for buyers, agents, admins
- **Roles** in dedicated `user_roles` table with `has_role()` security-definer function (no role on profiles)
- **Tables**: profiles, user_roles, agents, properties, property_images, amenities, favorites, saved_searches, inquiries, messages, viewings, agent_availability, offers, deals, deal_stages, documents, commissions, reviews, audit_log
- **Storage buckets**: property-images (public), floor-plans (public), documents (private, deal-scoped RLS)
- **RLS**: strict per-role policies — agents only see their own leads/deals, buyers only their own data, admins see all
- **Edge functions**: saved-search alert sender, viewing reminders, offer notifications

## Design Direction (Luxury/Premium)
- Dark navy background (`#0B1426`-ish), warm gold accents (`#C9A961`)
- Serif display font (Playfair/Cormorant) for headings, clean sans (Inter) for body
- Generous whitespace, large hero photography, subtle gold dividers
- Polished cards with soft shadows, gold-bordered CTAs

## Build Order
1. Design system (luxury palette, serif/sans pairing) + public layout (header, footer)
2. Backend schema, roles, RLS, storage buckets
3. Auth + role-based routing
4. Public listings (home, search, detail) with map
5. Buyer dashboard (favorites, saved searches, viewings, offers, messages)
6. Agent dashboard (listings CRUD, leads, viewings calendar, offers)
7. Deal pipeline (Kanban) + documents + commissions
8. Admin dashboard (approvals, users, analytics)
9. Notifications & email alerts
