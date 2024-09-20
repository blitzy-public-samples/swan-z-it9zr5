CREATE TABLE custom_designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    design_elements JSONB NOT NULL,
    preview_image TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create indexes for frequently queried fields
CREATE INDEX idx_custom_designs_user_id ON custom_designs(user_id);
CREATE INDEX idx_custom_designs_product_id ON custom_designs(product_id);
CREATE INDEX idx_custom_designs_is_public ON custom_designs(is_public);

-- Create a trigger to update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_custom_designs_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_custom_designs_timestamp
BEFORE UPDATE ON custom_designs
FOR EACH ROW
EXECUTE FUNCTION update_custom_designs_timestamp();

-- Add a check constraint to ensure the product is customizable
ALTER TABLE custom_designs
ADD CONSTRAINT check_product_customizable
CHECK (
    EXISTS (
        SELECT 1
        FROM products
        WHERE products.id = custom_designs.product_id
        AND products.is_customizable = true
    )
);

-- Comment to document the design_elements JSONB structure
COMMENT ON COLUMN custom_designs.design_elements IS 'JSON structure containing design elements. Expected format: 
{
    "elements": [
        {
            "type": "text|image|shape",
            "content": "element content or URL",
            "position": {"x": float, "y": float},
            "size": {"width": float, "height": float},
            "rotation": float,
            "color": "hex color code",
            "font": "font name (for text elements)"
        }
    ]
}';