# Launch readiness — and a real booking system by Monday

Right now every page reads from example data built into the site: the services, prices, stylists, time slots, the booking screen and the admin diary are all pretence. Nothing a customer books is saved anywhere. Sign-in and registration are the only parts genuinely connected to your database.

Below is what it takes to make the booking side real first, then what's left before launch.

## Priority 1 — Booking that actually works (target: Monday)

### 1. Small database update (one SQL script you run, like before)
Your current tables assume every booking belongs to a registered account, and there's nowhere to store when the salon and each stylist actually work. I'll write one script that adds:
- Guest bookings: name, phone and email on a booking, with the account link optional.
- Opening hours per weekday, plus a way to block out holidays and one-off closures.
- Each stylist's own working days and which services they perform.
- A rule that stops two bookings landing on the same stylist at the same time.
- A short reference code for each booking (e.g. LG-4821) so staff and customers can quote it.

### 2. Real booking flow on the website
- Services, prices, durations and stylists all pulled from the database (so what admin changes is what customers see).
- A real calendar: pick a date, see only genuinely free times for the chosen stylist, based on your opening hours and the service length. Fully booked days and closed dates are unselectable.
- "Any available stylist" option.
- Guest details form (name, phone, email) with an optional "create an account" tick.
- Signed-in customers get their details filled in automatically.
- Booking is saved with a last-second double check so two people can't grab the same slot.
- Confirmation screen with the reference code, date, stylist, service and price. No emails for now, as agreed.

### 3. Admin diary
- Today / this week / by-date view of real bookings with customer name and phone.
- Confirm, complete, cancel, mark no-show, and reschedule to another free slot.
- Add a booking manually for phone and walk-in customers.
- Manage services (name, price, duration, active) and stylists (name, working days, services) — no more hard-coded lists.
- Set opening hours and closure dates.

### 4. Customer area
- Upcoming and past visits from the real database, with cancel and reschedule.
- The rest of the member area (loyalty, rewards, referrals, coupons) stays as sample content for now — see below.

## Priority 2 — Before you go live
- Contact form and WhatsApp enquiries saved to the database instead of vanishing.
- Reviews: real submissions, with admin approval before they show.
- Gallery and journal posts loaded from the database and editable in admin.
- Loyalty, rewards, coupons and referrals wired to real data (currently all sample).
- Admin settings page actually saving (opening hours, contact details, social links).
- Replace remaining placeholder photos, stylist names and testimonials with your real ones.
- Publish, connect your domain, then submit the sitemap to Google.

## What I need from you
- Real service list with prices and how long each takes.
- Your stylists' names and which days they work.
- Slot spacing preference (every 15, 20 or 30 minutes).
- How far ahead people can book (e.g. 8 weeks) and the minimum notice (e.g. 2 hours).

If you don't have these by Monday I'll launch the booking system with sensible defaults and you can edit everything in admin.

## Technical notes
- New SQL migration file in `/mnt/documents` covering: `bookings` guest columns (`customer_id` nullable, `guest_name/email/phone`, `reference`), `salon_hours`, `salon_closures`, `stylist_schedules`, `stylist_services`, an exclusion/unique constraint on `(stylist_id, scheduled_at)`, plus RLS updates so anonymous inserts are allowed only through a server function.
- Availability and booking creation go through `createServerFn` handlers using the service-role client (`src/lib/supabase/admin.server.ts`) so guests can book without an account while RLS stays locked down; reads of services/stylists use the public anon policies already in place.
- New `src/lib/booking/*.functions.ts`: `listServices`, `listStylists`, `getAvailability({date, serviceId, stylistId})`, `createBooking`, `cancelBooking`, `rescheduleBooking`; admin equivalents guarded by an `is_staff` check on the caller.
- `src/routes/booking.tsx` rewritten to consume these (TanStack Query), replacing the hard-coded `barbers`/`times` arrays.
- `src/routes/admin.tsx` `BookingsTab`, `PricingTab` and stylist management switched from `mock-data` to live queries with mutations; `src/routes/dashboard.tsx` appointments sections likewise.
