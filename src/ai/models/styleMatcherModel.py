import tensorflow as tf
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from src.shared.constants.index import StyleLines
import joblib

class StyleMatcherModel:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        
        # Define input shape based on number of features in user preferences
        input_shape = (len(StyleLines),)  # Assuming one feature per style line
        
        # Create sequential model
        self.model = tf.keras.Sequential([
            tf.keras.layers.Dense(64, activation='relu', input_shape=input_shape),
            tf.keras.layers.Dense(32, activation='relu'),
            tf.keras.layers.Dense(len(StyleLines), activation='softmax')
        ])
        
        # Compile the model
        self.model.compile(optimizer='adam',
                           loss='categorical_crossentropy',
                           metrics=['accuracy'])

    def train(self, user_preferences, style_line_labels):
        # Split data into training and validation sets
        X_train, X_val, y_train, y_val = train_test_split(
            user_preferences, style_line_labels, test_size=0.2, random_state=42
        )
        
        # Normalize input data
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_val_scaled = self.scaler.transform(X_val)
        
        # Convert labels to one-hot encoded format
        y_train_encoded = tf.keras.utils.to_categorical(y_train)
        y_val_encoded = tf.keras.utils.to_categorical(y_val)
        
        # Train the model
        history = self.model.fit(
            X_train_scaled, y_train_encoded,
            validation_data=(X_val_scaled, y_val_encoded),
            epochs=50, batch_size=32, verbose=1
        )
        
        return history

    def predict_style_line(self, user_preferences):
        # Normalize input
        user_preferences_scaled = self.scaler.transform(user_preferences.reshape(1, -1))
        
        # Predict probabilities
        predictions = self.model.predict(user_preferences_scaled)
        
        # Get index of highest probability
        predicted_index = np.argmax(predictions[0])
        
        # Return corresponding style line
        return StyleLines(predicted_index).name

    def save_model(self, filepath):
        # Save the keras model
        tf.keras.models.save_model(self.model, filepath)
        
        # Save the scaler
        joblib.dump(self.scaler, f"{filepath}_scaler.pkl")

    def load_model(self, filepath):
        # Load the keras model
        self.model = tf.keras.models.load_model(filepath)
        
        # Load the scaler
        self.scaler = joblib.load(f"{filepath}_scaler.pkl")