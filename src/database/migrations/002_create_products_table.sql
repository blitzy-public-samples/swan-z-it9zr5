CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    images TEXT[] NOT NULL,
    style_line_id UUID NOT NULL,
    sizes TEXT[] NOT NULL,
    colors TEXT[] NOT NULL,
    is_customizable BOOLEAN DEFAULT false,
    stock_quantity INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_style_line FOREIGN KEY (style_line_id) REFERENCES style_lines(id) ON DELETE CASCADE
);

-- Create indexes for frequently queried fields
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_style_line_id ON products(style_line_id);

-- Add check constraints for non-negative base_price and stock_quantity
ALTER TABLE products ADD CONSTRAINT chk_positive_base_price CHECK (base_price >= 0);
ALTER TABLE products ADD CONSTRAINT chk_positive_stock_quantity CHECK (stock_quantity >= 0);

-- Create a trigger for updating the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_products_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_products_timestamp();

-- Add full-text search index on name and description
CREATE INDEX idx_products_fts ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Grant necessary permissions (adjust as needed)
GRANT SELECT, INSERT, UPDATE, DELETE ON products TO your_app_user;

-- Add soft delete functionality
ALTER TABLE products ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;