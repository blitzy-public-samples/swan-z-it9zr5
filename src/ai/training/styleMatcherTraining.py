import tensorflow as tf
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from src.ai.models.styleMatcherModel import StyleMatcherModel
from src.ai.utils.dataPreprocessing import preprocess_style_data
from src.ai.utils.modelEvaluation import evaluate_style_matcher
from src.shared.constants import MODEL_SAVE_PATH, STYLE_DATA_PATH
import logging

# Global constants
BATCH_SIZE = 32
EPOCHS = 100
LEARNING_RATE = 0.001

def load_and_preprocess_data():
    """
    Loads the style data from CSV and preprocesses it for training
    
    Returns:
        tuple: Preprocessed features and labels
    """
    # Load style data from CSV file
    df = pd.read_csv(STYLE_DATA_PATH)
    
    # Preprocess the data using preprocess_style_data function
    preprocessed_data = preprocess_style_data(df)
    
    # Split features and labels
    features = preprocessed_data.drop('style_label', axis=1)
    labels = preprocessed_data['style_label']
    
    # Perform train-test split
    X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)
    
    # Scale the features using StandardScaler
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    return X_train_scaled, X_test_scaled, y_train, y_test

def create_and_compile_model(input_shape):
    """
    Creates and compiles the StyleMatcherModel
    
    Args:
        input_shape (int): The shape of the input data
    
    Returns:
        StyleMatcherModel: Compiled StyleMatcherModel
    """
    # Create StyleMatcherModel instance
    model = StyleMatcherModel(input_shape)
    
    # Compile the model with Adam optimizer and appropriate loss function
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def train_model(model, X_train, y_train, X_val, y_val):
    """
    Trains the StyleMatcherModel on the preprocessed data
    
    Args:
        model (StyleMatcherModel): The model to train
        X_train (np.ndarray): Training features
        y_train (np.ndarray): Training labels
        X_val (np.ndarray): Validation features
        y_val (np.ndarray): Validation labels
    
    Returns:
        tf.keras.callbacks.History: Training history
    """
    # Set up EarlyStopping and ModelCheckpoint callbacks
    early_stopping = tf.keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True)
    model_checkpoint = tf.keras.callbacks.ModelCheckpoint(
        MODEL_SAVE_PATH,
        save_best_only=True,
        monitor='val_accuracy'
    )
    
    # Train the model using fit method
    history = model.fit(
        X_train, y_train,
        batch_size=BATCH_SIZE,
        epochs=EPOCHS,
        validation_data=(X_val, y_val),
        callbacks=[early_stopping, model_checkpoint]
    )
    
    return history

def main():
    """
    Main function to orchestrate the training process
    """
    # Set up logging
    logging.basicConfig(level=logging.INFO)
    
    # Load and preprocess data
    logging.info("Loading and preprocessing data...")
    X_train, X_test, y_train, y_test = load_and_preprocess_data()
    
    # Create and compile the model
    logging.info("Creating and compiling the model...")
    input_shape = X_train.shape[1]
    model = create_and_compile_model(input_shape)
    
    # Train the model
    logging.info("Training the model...")
    history = train_model(model, X_train, y_train, X_test, y_test)
    
    # Evaluate the model
    logging.info("Evaluating the model...")
    evaluation_results = evaluate_style_matcher(model, X_test, y_test)
    logging.info(f"Evaluation results: {evaluation_results}")
    
    # Save the trained model
    logging.info(f"Saving the trained model to {MODEL_SAVE_PATH}...")
    tf.keras.models.save_model(model, MODEL_SAVE_PATH)
    
    # Log training completion
    logging.info("Training completed successfully!")

if __name__ == "__main__":
    main()