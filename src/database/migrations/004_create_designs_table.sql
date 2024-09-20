-- Up migration
CREATE TABLE designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    product_id UUID NOT NULL REFERENCES products(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    design_data JSONB NOT NULL,
    preview_url VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for foreign keys and frequently queried columns
CREATE INDEX idx_designs_user_id ON designs(user_id);
CREATE INDEX idx_designs_product_id ON designs(product_id);
CREATE INDEX idx_designs_status ON designs(status);

-- Add CHECK constraint for status field
ALTER TABLE designs ADD CONSTRAINT check_design_status 
    CHECK (status IN ('draft', 'pending', 'approved', 'rejected'));

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_designs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_designs_timestamp
BEFORE UPDATE ON designs
FOR EACH ROW
EXECUTE FUNCTION update_designs_updated_at();

-- Down migration
DROP TABLE IF EXISTS designs;
DROP FUNCTION IF EXISTS update_designs_updated_at();