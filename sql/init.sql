-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pets table
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
  health_status VARCHAR(100) NOT NULL,
  adoption_requirements TEXT[],
  description TEXT NOT NULL,
  images TEXT[] NOT NULL,
  location_address VARCHAR(255) NOT NULL,
  location_coordinates POINT,
  location_suitability TEXT[],
  diet_type VARCHAR(255),
  diet_frequency VARCHAR(255),
  toys TEXT[],
  space_requirements JSONB,
  compatibility JSONB,
  adoption_fee INTEGER NOT NULL,
  availability_status VARCHAR(50) DEFAULT 'Available',
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_pets_species ON pets(species);
CREATE INDEX IF NOT EXISTS idx_pets_availability ON pets(availability_status);
CREATE INDEX IF NOT EXISTS idx_adoption_applications_user_id ON adoption_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_adoption_applications_pet_id ON adoption_applications(pet_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);

-- Insert sample pets data
INSERT INTO pets (
  name, species, breed, age, gender, size, temperament, activity_level, 
  health_status, adoption_requirements, description, images, location_address,
  location_suitability, diet_type, diet_frequency, toys, space_requirements,
  compatibility, adoption_fee
) VALUES 
(
  'Luna', 'Dog', 'Golden Retriever', 3, 'Female', 'Large',
  ARRAY['Friendly', 'Energetic', 'Loyal'], 'High', 'Excellent',
  ARRAY['Fenced yard', 'Experience with large dogs'],
  'Luna is a beautiful Golden Retriever who loves playing fetch and swimming. She''s great with kids and other dogs.',
  ARRAY['https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'],
  'San Francisco, CA', ARRAY['Urban', 'Suburban'],
  'High-quality dry food', 'Twice daily',
  ARRAY['Tennis balls', 'Rope toys', 'Frisbee'],
  '{"indoor": "Large living space", "outdoor": "Large yard", "yardSize": "Medium to large"}',
  '{"children": true, "otherPets": true, "apartments": false}',
  250
);

-- Add user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  species TEXT[] DEFAULT '{}',
  breeds TEXT[] DEFAULT '{}',
  size TEXT[] DEFAULT '{}',
  age_range INTEGER[] DEFAULT '{0,15}',
  gender TEXT[] DEFAULT '{}',
  temperament TEXT[] DEFAULT '{}',
  activity_level TEXT[] DEFAULT '{}',
  special_needs BOOLEAN DEFAULT FALSE,
  housing_type VARCHAR(100),
  yard_size VARCHAR(100),
  experience_level VARCHAR(100),
  time_available VARCHAR(100),
  location JSONB,
  max_distance INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);