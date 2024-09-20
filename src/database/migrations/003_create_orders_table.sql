-- Create orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    shipping_address JSONB NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_status CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    CONSTRAINT chk_payment_status CHECK (payment_status IN ('pending', 'paid', 'failed')),
    CONSTRAINT chk_positive_amount CHECK (total_amount >= 0)
);

-- Create indexes for frequently queried fields
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Create order_items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    custom_design_id UUID,
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    CONSTRAINT fk_custom_design FOREIGN KEY (custom_design_id) REFERENCES custom_designs(id) ON DELETE SET NULL,
    CONSTRAINT chk_positive_quantity CHECK (quantity > 0),
    CONSTRAINT chk_positive_price CHECK (price >= 0)
);

-- Create index on order_id for faster joins
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Create trigger function for updating 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for orders table
CREATE TRIGGER update_orders_modtime
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create trigger for order_items table
CREATE TRIGGER update_order_items_modtime
BEFORE UPDATE ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Add comment to document shipping_address structure
COMMENT ON COLUMN orders.shipping_address IS 'JSONB structure: {
    "full_name": "string",
    "address_line1": "string",
    "address_line2": "string",
    "city": "string",
    "state": "string",
    "postal_code": "string",
    "country": "string",
    "phone_number": "string"
}';