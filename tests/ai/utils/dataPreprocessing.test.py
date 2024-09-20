import unittest
import numpy as np
import pandas as pd
from src.ai.utils.dataPreprocessing import *

class TestDataPreprocessing(unittest.TestCase):
    def setUp(self):
        # Create sample data for testing
        self.sample_image = np.random.rand(100, 100, 3) * 255
        self.sample_categorical = pd.DataFrame({'category': ['A', 'B', 'C', 'A', 'D']})
        self.sample_numerical = pd.DataFrame({'value': [1, 2, 3, 100, 5]})
        self.sample_missing = pd.DataFrame({'A': [1, 2, np.nan, 4], 'B': ['a', 'b', 'c', np.nan]})
        self.sample_time = pd.DataFrame({'date': pd.date_range(start='2021-01-01', periods=5)})
        self.sample_text = pd.Series(['Hello world!', 'Testing 123', 'Special chars: @#$'])

    def test_normalize_image_data(self):
        normalized = normalize_image_data(self.sample_image)
        self.assertTrue(np.all(normalized >= 0) and np.all(normalized <= 1))
        
        # Test edge cases
        black_image = np.zeros((10, 10, 3))
        white_image = np.ones((10, 10, 3)) * 255
        self.assertTrue(np.all(normalize_image_data(black_image) == 0))
        self.assertTrue(np.all(normalize_image_data(white_image) == 1))

    def test_encode_categorical_features(self):
        encoded = encode_categorical_features(self.sample_categorical)
        self.assertEqual(encoded.shape[1], 4)  # 4 unique categories
        self.assertTrue(np.all(encoded.sum(axis=1) == 1))  # One-hot encoding check
        
        # Test handling of new category
        new_data = pd.DataFrame({'category': ['E']})
        encoded_new = encode_categorical_features(new_data, encoder=encoded.columns)
        self.assertEqual(encoded_new.shape[1], 4)  # Should maintain original categories
        self.assertTrue(np.all(encoded_new == 0))  # New category should be all zeros

    def test_scale_numerical_features(self):
        scaled = scale_numerical_features(self.sample_numerical)
        self.assertTrue(np.abs(scaled.mean()[0]) < 1e-10)  # Mean should be close to 0
        self.assertTrue(np.abs(scaled.std()[0] - 1) < 1e-10)  # Std should be close to 1
        
        # Test handling of outliers
        outlier_data = pd.DataFrame({'value': [1, 2, 3, 1000]})
        scaled_outlier = scale_numerical_features(outlier_data)
        self.assertTrue(scaled_outlier.max()[0] > 3)  # Outlier should still be present but scaled

    def test_handle_missing_values(self):
        handled = handle_missing_values(self.sample_missing)
        self.assertTrue(handled['A'].isnull().sum() == 0)  # Numerical column should be imputed
        self.assertTrue(handled['B'].isnull().sum() == 0)  # Categorical column should be imputed
        self.assertTrue('unknown' in handled['B'].values)  # Categorical missing should be replaced with 'unknown'

    def test_create_time_features(self):
        time_features = create_time_features(self.sample_time['date'])
        self.assertTrue('day_of_week' in time_features.columns)
        self.assertTrue('month' in time_features.columns)
        self.assertTrue('is_weekend' in time_features.columns)
        
        # Test different time formats
        diverse_times = pd.Series(['2021-01-01', '01/15/2021', '2021-02-01 15:30:00'])
        diverse_features = create_time_features(pd.to_datetime(diverse_times))
        self.assertEqual(len(diverse_features), 3)

    def test_text_tokenization(self):
        tokens = text_tokenization(self.sample_text)
        self.assertTrue(all(isinstance(t, list) for t in tokens))
        self.assertEqual(len(tokens[0]), 2)  # 'Hello world!' should be two tokens
        
        # Test special characters
        special_chars_tokens = tokens[2]
        self.assertTrue(any('@' in token for token in special_chars_tokens))
        
        # Test different languages (assuming the function supports it)
        multilang_text = pd.Series(['Hello', 'Bonjour', '你好'])
        multilang_tokens = text_tokenization(multilang_text)
        self.assertEqual(len(multilang_tokens), 3)

def main():
    unittest.main()

if __name__ == '__main__':
    main()