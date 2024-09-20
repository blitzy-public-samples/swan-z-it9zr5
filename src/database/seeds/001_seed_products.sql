-- Seed data for products table

-- Note: Prices are set based on a mid-range pricing strategy to appeal to a broad customer base
-- Customization is enabled for products where personalization adds significant value
-- Stock quantities are set based on expected initial demand and production capacity

-- Casual Style Line
INSERT INTO products (name, base_price, description, images, style_line_id, sizes, colors, is_customizable, stock_quantity) VALUES
('Classic T-Shirt', 19.99, 'A comfortable and versatile t-shirt for everyday wear. Made from 100% organic cotton.', 
 ARRAY['classic_tshirt_1.jpg', 'classic_tshirt_2.jpg'], 
 (SELECT id FROM style_lines WHERE name = 'CASUAL'), 
 ARRAY['S', 'M', 'L', 'XL'], 
 ARRAY['White', 'Black', 'Gray', 'Navy'], 
 true, 100),
('Casual Jeans', 59.99, 'Relaxed fit jeans perfect for casual outings. Features a comfortable stretch denim fabric.',
 ARRAY['casual_jeans_1.jpg', 'casual_jeans_2.jpg'],
 (SELECT id FROM style_lines WHERE name = 'CASUAL'),
 ARRAY['28', '30', '32', '34', '36'],
 ARRAY['Blue', 'Black', 'Gray'],
 false, 80);

-- Formal Style Line
INSERT INTO products (name, base_price, description, images, style_line_id, sizes, colors, is_customizable, stock_quantity) VALUES
('Elegant Blouse', 49.99, 'A sophisticated blouse perfect for formal occasions. Features delicate lace detailing.', 
 ARRAY['elegant_blouse_1.jpg', 'elegant_blouse_2.jpg'], 
 (SELECT id FROM style_lines WHERE name = 'FORMAL'), 
 ARRAY['XS', 'S', 'M', 'L'], 
 ARRAY['White', 'Cream', 'Black'], 
 false, 50),
('Business Suit', 199.99, 'A sharp, tailored suit for professional settings. Includes jacket and trousers.',
 ARRAY['business_suit_1.jpg', 'business_suit_2.jpg'],
 (SELECT id FROM style_lines WHERE name = 'FORMAL'),
 ARRAY['36', '38', '40', '42', '44'],
 ARRAY['Navy', 'Charcoal', 'Black'],
 true, 30);

-- Sporty Style Line
INSERT INTO products (name, base_price, description, images, style_line_id, sizes, colors, is_customizable, stock_quantity) VALUES
('Athletic Shorts', 29.99, 'Breathable and flexible shorts for your workout sessions. Features moisture-wicking fabric.', 
 ARRAY['athletic_shorts_1.jpg', 'athletic_shorts_2.jpg'], 
 (SELECT id FROM style_lines WHERE name = 'SPORTY'), 
 ARRAY['S', 'M', 'L', 'XL'], 
 ARRAY['Black', 'Navy', 'Gray', 'Red'], 
 true, 75),
('Performance Tank Top', 24.99, 'Lightweight tank top for high-intensity workouts. Made with quick-dry technology.',
 ARRAY['performance_tank_1.jpg', 'performance_tank_2.jpg'],
 (SELECT id FROM style_lines WHERE name = 'SPORTY'),
 ARRAY['XS', 'S', 'M', 'L', 'XL'],
 ARRAY['White', 'Black', 'Blue', 'Green'],
 true, 60);

-- Bohemian Style Line
INSERT INTO products (name, base_price, description, images, style_line_id, sizes, colors, is_customizable, stock_quantity) VALUES
('Boho Maxi Dress', 79.99, 'A flowing maxi dress with a bohemian flair. Features intricate embroidery and a relaxed fit.', 
 ARRAY['boho_dress_1.jpg', 'boho_dress_2.jpg'], 
 (SELECT id FROM style_lines WHERE name = 'BOHEMIAN'), 
 ARRAY['XS', 'S', 'M', 'L'], 
 ARRAY['Floral', 'Earth Tones', 'Paisley'], 
 true, 30),
('Fringed Suede Bag', 69.99, 'A spacious boho-chic bag with playful fringe details. Perfect for festivals and casual outings.',
 ARRAY['fringed_bag_1.jpg', 'fringed_bag_2.jpg'],
 (SELECT id FROM style_lines WHERE name = 'BOHEMIAN'),
 ARRAY['One Size'],
 ARRAY['Tan', 'Brown', 'Black'],
 false, 40);

-- Vintage Style Line
INSERT INTO products (name, base_price, description, images, style_line_id, sizes, colors, is_customizable, stock_quantity) VALUES
('Vintage Denim Jacket', 89.99, 'A classic denim jacket with a vintage wash. Features distressed details for an authentic look.', 
 ARRAY['vintage_jacket_1.jpg', 'vintage_jacket_2.jpg'], 
 (SELECT id FROM style_lines WHERE name = 'VINTAGE'), 
 ARRAY['S', 'M', 'L', 'XL'], 
 ARRAY['Blue', 'Black', 'Light Wash'], 
 false, 40),
('Retro High-Waisted Shorts', 49.99, 'High-waisted shorts with a retro-inspired cut. Perfect for creating vintage-inspired looks.',
 ARRAY['retro_shorts_1.jpg', 'retro_shorts_2.jpg'],
 (SELECT id FROM style_lines WHERE name = 'VINTAGE'),
 ARRAY['XS', 'S', 'M', 'L'],
 ARRAY['Denim Blue', 'Black', 'Red'],
 true, 50);

-- Minimalist Style Line
INSERT INTO products (name, base_price, description, images, style_line_id, sizes, colors, is_customizable, stock_quantity) VALUES
('Minimalist Watch', 129.99, 'A sleek and simple watch for the minimalist enthusiast. Features a clean dial and premium materials.', 
 ARRAY['minimalist_watch_1.jpg', 'minimalist_watch_2.jpg'], 
 (SELECT id FROM style_lines WHERE name = 'MINIMALIST'), 
 ARRAY['One Size'], 
 ARRAY['Silver', 'Gold', 'Rose Gold', 'Black'], 
 false, 25),
('Essential Tote Bag', 79.99, 'A clean-lined, spacious tote bag perfect for everyday use. Made from high-quality vegan leather.',
 ARRAY['essential_tote_1.jpg', 'essential_tote_2.jpg'],
 (SELECT id FROM style_lines WHERE name = 'MINIMALIST'),
 ARRAY['One Size'],
 ARRAY['Black', 'Tan', 'Gray', 'White'],
 true, 35);

-- Note: ARRAY is used for sizes and colors to allow flexible querying and filtering
-- This approach allows for easy addition or removal of options without changing the schema
-- However, it may require additional application logic to handle these array fields properly