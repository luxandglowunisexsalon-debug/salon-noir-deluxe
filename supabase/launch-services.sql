-- Lux & Glow launch treatment menu.
-- Run this against the production Supabase database before launch.
-- Prices are stored in pence. Existing services are disabled first so only
-- the launch menu is bookable.

begin;

update services set active = false where active = true;

update service_categories
set slug = lower(trim(both '-' from regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')))
where slug is null;

insert into service_categories (slug, name, sort_order)
select slug, category, sort_order
from (values
  ('head-spa', 'Head Spa', 1),
  ('facial', 'Facial', 2),
  ('waxing', 'Waxing', 3),
  ('pedicure', 'Pedicure', 4),
  ('manicure', 'Manicure', 5)
) as categories(slug, category, sort_order)
on conflict (slug) do update set
  name = excluded.name,
  sort_order = excluded.sort_order;

with launch_services(slug, name, description, duration_minutes, price_pence, category, sort_order) as (
  values
    ('mini-head-spa', 'Mini Head Spa', 'A restorative Japanese head spa ritual.', 30, 6500, 'Head Spa', 1),
    ('luxury-head-spa', 'Luxury Head Spa', 'The complete Japanese head spa experience.', 60, 9500, 'Head Spa', 2),
    ('brightening-facial', 'Brightening Facial', 'A fresh, luminous facial treatment.', 45, 5500, 'Facial', 1),
    ('herbal-facial', 'Herbal Facial', 'A calming facial treatment with herbal care.', 45, 5000, 'Facial', 2),
    ('gold-facial', 'Gold Facial', 'A refined radiance treatment with a golden finish.', 45, 6000, 'Facial', 3),
    ('diamond-facial', 'Diamond Facial', 'A polished facial ritual for renewed skin.', 45, 7000, 'Facial', 4),
    ('deep-clean-facial', 'Deep Clean Facial', 'A thorough deep-cleansing facial treatment.', 45, 4000, 'Facial', 5),
    ('black-head-removal', 'Black Head Removal', 'Targeted blackhead removal treatment.', 30, 1500, 'Facial', 6),
    ('face-mask', 'Face Mask', 'A focused mask treatment for refreshed skin.', 30, 2000, 'Facial', 7),
    ('hydra-facial', 'Hydra Facial', 'An intensive hydration and renewal treatment.', 60, 11000, 'Facial', 8),
    ('back-wax', 'Back Wax', 'Professional back waxing treatment.', 30, 2900, 'Waxing', 1),
    ('chest-and-stomach-wax', 'Chest and Stomach Wax', 'Professional chest and stomach waxing treatment.', 30, 2900, 'Waxing', 2),
    ('arm-wax', 'Arm Wax', 'Professional arm waxing treatment.', 15, 2500, 'Waxing', 3),
    ('leg-wax', 'Leg Wax', 'Professional leg waxing treatment.', 30, 3500, 'Waxing', 4),
    ('shoulder-wax', 'Shoulder Wax', 'Professional shoulder waxing treatment.', 15, 1250, 'Waxing', 5),
    ('under-arm-wax', 'Under Arm Wax', 'Professional under arm waxing treatment.', 15, 1250, 'Waxing', 6),
    ('eyebrows-wax', 'Eyebrows', 'Precision eyebrow waxing treatment.', 15, 950, 'Waxing', 7),
    ('nose-wax', 'Nose Wax', 'Quick and precise nose waxing treatment.', 15, 500, 'Waxing', 8),
    ('ear-wax', 'Ear Wax', 'Quick and precise ear waxing treatment.', 15, 500, 'Waxing', 9),
    ('dry-pedicure', 'Dry Pedicure', 'A clean, considered dry pedicure.', 30, 3000, 'Pedicure', 1),
    ('luxury-pedicure', 'Luxury Pedicure', 'A complete luxury pedicure ritual.', 45, 4500, 'Pedicure', 2),
    ('japanese-spa-foot-treatment', 'Japanese Spa Foot Treatment', 'A restorative Japanese spa foot treatment.', 60, 5000, 'Pedicure', 3),
    ('dry-manicure', 'Dry Manicure', 'A clean, considered dry manicure.', 30, 2500, 'Manicure', 1),
    ('luxury-manicure', 'Luxury Manicure', 'A complete luxury manicure ritual.', 45, 3500, 'Manicure', 2)
)
insert into services (slug, name, description, duration_minutes, price_pence, category_id, featured, active)
select
  launch.slug,
  launch.name,
  launch.description,
  launch.duration_minutes,
  launch.price_pence,
  category.id,
  launch.sort_order <= 2,
  true
from launch_services launch
join service_categories category on lower(category.name) = lower(launch.category)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  duration_minutes = excluded.duration_minutes,
  price_pence = excluded.price_pence,
  category_id = excluded.category_id,
  featured = excluded.featured,
  active = excluded.active;

insert into stylist_services (stylist_id, service_id)
select stylist.id, service.id
from stylists stylist
cross join services service
where stylist.active = true
  and service.active = true
on conflict (stylist_id, service_id) do nothing;

commit;
