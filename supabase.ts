
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bzkwvctlhbpwrixnnoxw.supabase.co';
const supabaseAnonKey = 'sb_publishable_nlB4zjhzT0Q8PKgp5J-lAA_ZaNt6ZjD';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * DATABASE SCHEMA UTILITY
 * Run these in your Supabase SQL Editor:
 * 
 * CREATE TABLE restaurants (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   name TEXT NOT NULL,
 *   cuisine TEXT[],
 *   rating FLOAT DEFAULT 4.5,
 *   delivery_time INT,
 *   distance FLOAT,
 *   image TEXT,
 *   price_range INT,
 *   location JSONB,
 *   is_open BOOLEAN DEFAULT true
 * );
 * 
 * CREATE TABLE menu_items (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
 *   name TEXT NOT NULL,
 *   description TEXT,
 *   price FLOAT NOT NULL,
 *   category TEXT,
 *   image TEXT,
 *   is_veg BOOLEAN DEFAULT true,
 *   available BOOLEAN DEFAULT true
 * );
 * 
 * CREATE TABLE orders (
 *   id TEXT PRIMARY KEY,
 *   customer_id TEXT NOT NULL,
 *   restaurant_id UUID REFERENCES restaurants(id),
 *   rider_id UUID,
 *   items JSONB NOT NULL,
 *   total_amount FLOAT NOT NULL,
 *   status TEXT DEFAULT 'PENDING',
 *   timestamp BIGINT,
 *   delivery_location JSONB
 * );
 */
