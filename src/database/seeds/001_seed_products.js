const faker = require('faker');

const PRODUCT_COUNT = 50;
const STYLE_LINES = [
  "Casual",
  "Formal",
  "Sporty",
  "Bohemian",
  "Vintage",
  "Minimalist",
  "Streetwear",
  "Elegant"
];

function generateProductData(count) {
  const products = [];
  for (let i = 0; i < count; i++) {
    const product = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      base_price: parseFloat(faker.commerce.price()),
      style_line: faker.random.arrayElement(STYLE_LINES),
      category: faker.commerce.department(),
      tags: faker.random.words(3).split(' '),
      image_url: faker.image.fashion(),
      stock_quantity: faker.datatype.number({ min: 0, max: 100 }),
      created_at: faker.date.past(),
      updated_at: faker.date.recent()
    };
    products.push(product);
  }
  return products;
}

async function seed(knex) {
  try {
    // Truncate the 'products' table
    await knex('products').truncate();

    // Generate product data
    const productData = generateProductData(PRODUCT_COUNT);

    // Insert the generated product data
    await knex('products').insert(productData);

    console.log(`Successfully inserted ${PRODUCT_COUNT} products.`);
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}

module.exports = {
  seed,
  generateProductData
};