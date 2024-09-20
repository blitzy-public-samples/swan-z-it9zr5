import tensorflow as tf
import numpy as np
import pandas as pd
import logging
from src.ai.models.designGeneratorModel import DesignGeneratorModel
from src.ai.utils.dataPreprocessing import preprocess_design_data
from src.ai.utils.modelEvaluation import evaluate_generated_designs
from src.shared.constants import DESIGN_CATEGORIES, STYLE_ATTRIBUTES

# Global constants
BATCH_SIZE = 32
EPOCHS = 100
LEARNING_RATE = 0.0002
LATENT_DIM = 100

def load_and_preprocess_data(data_path: str) -> tuple:
    """
    Loads and preprocesses the design data for training
    """
    # Load raw design data from CSV file
    raw_data = pd.read_csv(data_path)
    
    # Preprocess the data using preprocess_design_data function
    preprocessed_data = preprocess_design_data(raw_data)
    
    # Split data into features and labels
    features = preprocessed_data.drop('label', axis=1)
    labels = preprocessed_data['label']
    
    return features.values, labels.values

def build_and_compile_model() -> DesignGeneratorModel:
    """
    Builds and compiles the GAN model for design generation
    """
    # Initialize DesignGeneratorModel with appropriate parameters
    model = DesignGeneratorModel(latent_dim=LATENT_DIM, num_categories=len(DESIGN_CATEGORIES))
    
    # Compile the model with Adam optimizer and appropriate loss functions
    optimizer = tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE)
    model.compile(optimizer=optimizer)
    
    return model

def train_model(model: DesignGeneratorModel, train_data: np.ndarray, train_labels: np.ndarray) -> DesignGeneratorModel:
    """
    Trains the design generator model
    """
    # Create TensorFlow dataset from training data
    dataset = tf.data.Dataset.from_tensor_slices((train_data, train_labels)).shuffle(10000).batch(BATCH_SIZE)
    
    # Train the model for specified number of epochs
    for epoch in range(EPOCHS):
        for batch_data, batch_labels in dataset:
            model.train_step(batch_data, batch_labels)
        
        # Periodically evaluate the model using evaluate_generated_designs
        if (epoch + 1) % 10 == 0:
            evaluation_results = evaluate_generated_designs(model, train_data[:1000], train_labels[:1000])
            logging.info(f"Epoch {epoch + 1}/{EPOCHS} - Evaluation results: {evaluation_results}")
    
    return model

def save_model(model: DesignGeneratorModel, save_path: str) -> None:
    """
    Saves the trained model to disk
    """
    # Save the model using TensorFlow's saved_model format
    tf.saved_model.save(model, save_path)
    logging.info(f"Model saved successfully to {save_path}")

def main():
    # Set up logging configuration
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    # Load and preprocess training data
    data_path = "path/to/design_data.csv"
    train_data, train_labels = load_and_preprocess_data(data_path)
    
    # Build and compile the model
    model = build_and_compile_model()
    
    # Train the model
    trained_model = train_model(model, train_data, train_labels)
    
    # Save the trained model
    save_path = "path/to/saved_model"
    save_model(trained_model, save_path)
    
    logging.info("Training process completed successfully")

if __name__ == "__main__":
    main()