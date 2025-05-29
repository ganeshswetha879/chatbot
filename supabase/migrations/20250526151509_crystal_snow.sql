/*
  # Initial Schema Setup for GuardianBot

  1. New Tables
    - `issues`
      - For tracking reported community issues
      - Includes location, type, status, and reporter info
    - `chat_messages`
      - For storing chat support messages
    - `community_posts`
      - For community hub posts and updates

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated and anonymous access
*/

-- Issues table
CREATE TABLE IF NOT EXISTS issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  description text NOT NULL,
  reporter_name text,
  reporter_phone text,
  location geometry(Point, 4326),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous users to create issues"
  ON issues FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view all issues"
  ON issues FOR SELECT
  TO authenticated
  USING (true);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  role text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous users to create and view chat messages"
  ON chat_messages
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Community posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caption text NOT NULL,
  hashtags text[] DEFAULT '{}',
  media_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous users to view community posts"
  ON community_posts FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated users to create community posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);