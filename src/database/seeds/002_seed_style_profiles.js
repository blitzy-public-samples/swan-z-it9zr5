const faker = require('faker');

// Helper function to generate a single style profile
const generateStyleProfile = () => {
  const stylePreferences = [
    'Casual', 'Formal', 'Bohemian', 'Vintage', 'Minimalist', 'Streetwear', 'Preppy', 'Sporty'
  ];

  const colorPreferences = [
    'Neutral', 'Bright', 'Pastel', 'Dark', 'Monochrome', 'Earth tones'
  ];

  const fitPreferences = [
    'Loose', 'Fitted', 'Oversized', 'Tailored', 'Relaxed'
  ];

  return {
    user_id: faker.datatype.uuid(),
    quiz_responses: {
      preferred_styles: faker.random.arrayElements(stylePreferences, faker.datatype.number({ min: 1, max: 3 })),
      color_palette: faker.random.arrayElement(colorPreferences),
      fit_preference: faker.random.arrayElement(fitPreferences),
      budget_range: faker.random.arrayElement(['Low', 'Medium', 'High']),
      age: faker.datatype.number({ min: 18, max: 80 }),
      gender: faker.random.arrayElement(['Male', 'Female', 'Non-binary']),
      occasion_preference: faker.random.arrayElement(['Casual', 'Work', 'Evening', 'Special events']),
      brand_preference: faker.company.companyName(),
      sustainability_importance: faker.datatype.number({ min: 1, max: 5 })
    },
    created_at: faker.date.past(),
    updated_at: faker.date.recent()
  };
};

// Main seed function
exports.seed = async function(knex) {
  // Truncate the style_profiles table
  await knex('style_profiles').truncate();

  // Generate an array of 100 style profiles
  const styleProfiles = Array.from({ length: 100 }, generateStyleProfile);

  // Insert the generated style profiles into the style_profiles table
  await knex('style_profiles').insert(styleProfiles);

  console.log('Style profiles seeded successfully');
};

// Export the generateStyleProfile function for potential reuse
exports.generateStyleProfile = generateStyleProfile;