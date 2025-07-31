-- Define custom ENUM types
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'user', 'foster-user');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'availability_status_enum') THEN
    CREATE TYPE availability_status_enum AS ENUM (
      'Available', 'Pending', 'Adopted', 'Fostered_Available', 'Fostered_Not_Available'
    );
  END IF;
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  location VARCHAR(255),
  contact_number VARCHAR(20),
  foster_capacity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pets table (updated)
CREATE TABLE IF NOT EXISTS pets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  species VARCHAR(100) NOT NULL,
  breed VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(20) NOT NULL,
  size VARCHAR(50) NOT NULL,
  temperament TEXT[] NOT NULL,
  activity_level VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL, -- Accepts URL or local path
  location_address VARCHAR(255), -- Optional
  location_coordinates POINT,    -- Optional
  diet_type VARCHAR(255),
  diet_frequency VARCHAR(255),
  space_requirements TEXT,       -- Simple text (or convert to JSONB if needed)
  adoption_fee INTEGER NOT NULL,
  availability_status availability_status_enum DEFAULT 'Available',
  foster_parent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create adoption applications table
CREATE TABLE IF NOT EXISTS adoption_applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  pet_id INTEGER REFERENCES pets(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'Pending',
  application_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  pet_id INTEGER REFERENCES pets(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, pet_id)
);

-- Add user preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  species TEXT[] DEFAULT '{}',
  size TEXT[] DEFAULT '{}',
  age_range INTEGER[] DEFAULT '{0,15}',
  gender TEXT[] DEFAULT '{}',
  temperament TEXT[] DEFAULT '{}',
  activity_level TEXT[] DEFAULT '{}',
  housing_type VARCHAR(100),
  yard_size VARCHAR(100),
  experience_level VARCHAR(100),
  time_available VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);


-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_pets_species ON pets(species);
CREATE INDEX IF NOT EXISTS idx_pets_availability ON pets(availability_status);
CREATE INDEX IF NOT EXISTS idx_adoption_applications_user_id ON adoption_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_adoption_applications_pet_id ON adoption_applications(pet_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_pets_temperament ON pets USING GIN (temperament);

ALTER TABLE users
  ALTER COLUMN location TYPE JSONB USING location::JSONB;

ALTER TABLE user_preferences
  DROP COLUMN IF EXISTS breeds,
  DROP COLUMN IF EXISTS special_needs,
  DROP COLUMN IF EXISTS location,
  DROP COLUMN IF EXISTS max_distance;
  
  ALTER TABLE adoption_applications
ADD COLUMN accepted_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE adoption_applications
RENAME COLUMN accepted_at TO action_performed_at;
