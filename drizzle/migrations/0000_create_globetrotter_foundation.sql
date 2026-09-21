CREATE TYPE public.travel_event_category AS ENUM ('nightlife', 'hiking', 'cultural', 'foodie', 'budget', 'extreme', 'wellness');
CREATE TYPE public.travel_style AS ENUM ('slow_travel', 'backpacker', 'luxury', 'foodie', 'adventure', 'culture', 'digital_nomad');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  display_name text NOT NULL,
  handle text NOT NULL UNIQUE,
  avatar_url text,
  bio text NOT NULL DEFAULT '',
  home_base text,
  countries_visited integer NOT NULL DEFAULT 0,
  travel_styles travel_style[] NOT NULL DEFAULT '{}',
  badges text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read public profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create their profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.travel_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category travel_event_category NOT NULL,
  starts_at timestamptz NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  price_amount numeric(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  max_attendees integer NOT NULL DEFAULT 12,
  rating numeric(2,1) NOT NULL DEFAULT 4.8,
  cover_url text,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.travel_events TO authenticated;
GRANT ALL ON public.travel_events TO service_role;
ALTER TABLE public.travel_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read travel events" ON public.travel_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create travel events" ON public.travel_events FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = creator_id AND p.user_id = auth.uid()));
CREATE POLICY "Creators can update travel events" ON public.travel_events FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = creator_id AND p.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = creator_id AND p.user_id = auth.uid()));

CREATE TABLE public.event_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.travel_events(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'joined',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, profile_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_attendees TO authenticated;
GRANT ALL ON public.event_attendees TO service_role;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read attendees" ON public.event_attendees FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can join events" ON public.event_attendees FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = profile_id AND p.user_id = auth.uid()));
CREATE POLICY "Users can manage their attendance" ON public.event_attendees FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = profile_id AND p.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = profile_id AND p.user_id = auth.uid()));

CREATE TABLE public.event_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.travel_events(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_messages TO authenticated;
GRANT ALL ON public.event_messages TO service_role;
ALTER TABLE public.event_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Attendees can read event chat" ON public.event_messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.event_attendees ea JOIN public.profiles p ON p.id = ea.profile_id WHERE ea.event_id = event_messages.event_id AND p.user_id = auth.uid()));
CREATE POLICY "Attendees can send event chat" ON public.event_messages FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.event_attendees ea JOIN public.profiles p ON p.id = ea.profile_id WHERE ea.event_id = event_messages.event_id AND ea.profile_id = event_messages.profile_id AND p.user_id = auth.uid()));

CREATE TABLE public.itinerary_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id uuid REFERENCES public.travel_events(id) ON DELETE SET NULL,
  title text NOT NULL,
  trip_day integer NOT NULL DEFAULT 1,
  position integer NOT NULL DEFAULT 0,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.itinerary_items TO authenticated;
GRANT ALL ON public.itinerary_items TO service_role;
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage itinerary items" ON public.itinerary_items FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = profile_id AND p.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = profile_id AND p.user_id = auth.uid()));

CREATE TABLE public.traveler_radar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  radius_km integer NOT NULL DEFAULT 3,
  active_until timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.traveler_radar TO authenticated;
GRANT ALL ON public.traveler_radar TO service_role;
ALTER TABLE public.traveler_radar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read active radar" ON public.traveler_radar FOR SELECT TO authenticated USING (active_until > now());
CREATE POLICY "Users can manage their radar" ON public.traveler_radar FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = profile_id AND p.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = profile_id AND p.user_id = auth.uid()));

CREATE INDEX travel_events_location_idx ON public.travel_events (latitude, longitude);
CREATE INDEX travel_events_starts_at_idx ON public.travel_events (starts_at);
CREATE INDEX event_messages_event_created_idx ON public.event_messages (event_id, created_at);

ALTER PUBLICATION supabase_realtime ADD TABLE public.travel_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_attendees;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.traveler_radar;