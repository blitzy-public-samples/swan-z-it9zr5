import unittest
import numpy as np
import tensorflow as tf
from src.ai.models.styleMatcherModel import StyleMatcherModel
from src.shared.constants.index import StyleLines

class TestStyleMatcherModel(unittest.TestCase):
    def setUp(self):
        self.model = StyleMatcherModel()
        self.sample_input = np.random.rand(1, 10)  # Assuming 10 features for user preferences

    def test_model_initialization(self):
        self.assertIsInstance(self.model, StyleMatcherModel)
        self.assertIsInstance(self.model.model, tf.keras.Model)
        self.assertEqual(len(self.model.model.layers), 3)  # Assuming 3 layers in the model

    def test_predict_style_line(self):
        prediction = self.model.predict_style_line(self.sample_input)
        self.assertIn(prediction, StyleLines.__members__)
        
        # Check consistency
        repeated_prediction = self.model.predict_style_line(self.sample_input)
        self.assertEqual(prediction, repeated_prediction)

    def test_train_model(self):
        X_train = np.random.rand(100, 10)
        y_train = np.random.randint(0, len(StyleLines), 100)
        
        initial_weights = self.model.model.get_weights()
        history = self.model.train(X_train, y_train, epochs=5, batch_size=32)
        
        self.assertNotEqual(initial_weights, self.model.model.get_weights())
        self.assertIn('loss', history.history)
        self.assertIn('accuracy', history.history)

    def test_model_accuracy(self):
        X_train = np.random.rand(1000, 10)
        y_train = np.random.randint(0, len(StyleLines), 1000)
        X_test = np.random.rand(200, 10)
        y_test = np.random.randint(0, len(StyleLines), 200)
        
        self.model.train(X_train, y_train, epochs=10, batch_size=32)
        _, accuracy = self.model.model.evaluate(X_test, y_test)
        
        self.assertGreater(accuracy, 0.5)  # Assuming a baseline accuracy of 50%

    def test_save_and_load_model(self):
        X_train = np.random.rand(100, 10)
        y_train = np.random.randint(0, len(StyleLines), 100)
        
        self.model.train(X_train, y_train, epochs=5, batch_size=32)
        original_prediction = self.model.predict_style_line(self.sample_input)
        
        self.model.save_model('temp_model.h5')
        loaded_model = StyleMatcherModel()
        loaded_model.load_model('temp_model.h5')
        
        loaded_prediction = loaded_model.predict_style_line(self.sample_input)
        self.assertEqual(original_prediction, loaded_prediction)

if __name__ == '__main__':
    unittest.main()