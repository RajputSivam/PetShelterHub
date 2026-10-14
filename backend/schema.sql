CREATE DATABASE IF NOT EXISTS PetShelterHub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE PetShelterHub;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pets (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  species VARCHAR(60) NOT NULL,
  breed VARCHAR(100) NOT NULL,
  age VARCHAR(60) NOT NULL,
  sex VARCHAR(30) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  status ENUM('available', 'pending', 'adopted') NOT NULL DEFAULT 'available',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS adoptions (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  pet_id INT UNSIGNED NOT NULL,
  applicant_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('pending', 'approved', 'declined') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_adoptions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_adoptions_pet FOREIGN KEY (pet_id) REFERENCES pets(id)
);

CREATE TABLE IF NOT EXISTS donations (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  donor_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_donations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS volunteers (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  availability VARCHAR(120) NOT NULL,
  interests TEXT NOT NULL,
  status ENUM('new', 'contacted', 'active') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_volunteers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO pets (name, species, breed, age, sex, description, image_url)
SELECT 'Milo', 'Dog', 'Indie mix', '2 years', 'Male', 'A bright, gentle soul who loves slow walks and learning new tricks.', 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85'
WHERE NOT EXISTS (SELECT 1 FROM pets WHERE name = 'Milo' AND species = 'Dog');

INSERT INTO pets (name, species, breed, age, sex, description, image_url)
SELECT 'Luna', 'Cat', 'Domestic shorthair', '1 year', 'Female', 'Curious and affectionate, Luna is happiest near a sunny window.', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=85'
WHERE NOT EXISTS (SELECT 1 FROM pets WHERE name = 'Luna' AND species = 'Cat');

INSERT INTO pets (name, species, breed, age, sex, description, image_url)
SELECT 'Biscuit', 'Dog', 'Labrador mix', '4 years', 'Male', 'Easygoing and people-loving, Biscuit is ready to be your best friend.', 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=900&q=85'
WHERE NOT EXISTS (SELECT 1 FROM pets WHERE name = 'Biscuit' AND species = 'Dog');