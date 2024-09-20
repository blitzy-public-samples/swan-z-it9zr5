CREATE TABLE style_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    quiz_responses JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_style_profiles_user_id ON style_profiles(user_id);

CREATE TABLE style_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    style_profile_id UUID NOT NULL,
    style_line VARCHAR(50) NOT NULL,
    preference_score INTEGER NOT NULL,
    CONSTRAINT fk_style_profile FOREIGN KEY (style_profile_id) REFERENCES style_profiles(id) ON DELETE CASCADE,
    CONSTRAINT chk_preference_score CHECK (preference_score >= 0 AND preference_score <= 100),
    UNIQUE (style_profile_id, style_line)
);

CREATE INDEX idx_style_preferences_style_profile_id ON style_preferences(style_profile_id);

CREATE OR REPLACE FUNCTION update_style_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_style_profile_timestamp
BEFORE UPDATE ON style_profiles
FOR EACH ROW
EXECUTE FUNCTION update_style_profile_timestamp();

COMMENT ON TABLE style_profiles IS 'Stores user style profiles including quiz responses';
COMMENT ON COLUMN style_profiles.quiz_responses IS 'JSON structure containing user responses to style quiz questions';

COMMENT ON TABLE style_preferences IS 'Stores individual style line preferences for each style profile';
COMMENT ON COLUMN style_preferences.style_line IS 'References style lines defined in StyleLines enum';

-- Ensure the sum of preference scores does not exceed 100
CREATE OR REPLACE FUNCTION check_total_preference_score()
RETURNS TRIGGER AS $$
DECLARE
    total_score INTEGER;
BEGIN
    SELECT COALESCE(SUM(preference_score), 0) INTO total_score
    FROM style_preferences
    WHERE style_profile_id = NEW.style_profile_id;
    
    total_score := total_score + NEW.preference_score;
    
    IF total_score > 100 THEN
        RAISE EXCEPTION 'Total preference score cannot exceed 100';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_total_preference_score
BEFORE INSERT OR UPDATE ON style_preferences
FOR EACH ROW
EXECUTE FUNCTION check_total_preference_score();