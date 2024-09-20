import tensorflow as tf
import numpy as np
from PIL import Image
from src.ai.models.designGeneratorModel import DesignGeneratorModel
from src.shared.utils.formatters import format_design_output
from src.shared.constants import DESIGN_GENERATION_CONFIG
from src.backend.services.designService import save_generated_design

MODEL_PATH = "path/to/saved/design_generator_model"

def load_model():
    """
    Loads the pre-trained design generator model
    
    Returns:
        DesignGeneratorModel: Loaded TensorFlow model for design generation
    """
    try:
        model = tf.keras.models.load_model(MODEL_PATH, custom_objects={'DesignGeneratorModel': DesignGeneratorModel})
        return model
    except Exception as e:
        raise Exception(f"Failed to load model: {str(e)}")

def preprocess_input(user_input):
    """
    Preprocesses user input for the design generator model
    
    Args:
        user_input (dict): User input containing design preferences
    
    Returns:
        np.array: Preprocessed input array
    """
    # Extract relevant features from user_input
    features = [
        user_input.get('color', 0),
        user_input.get('style', 0),
        user_input.get('pattern', 0),
        # Add more features as needed
    ]
    
    # Normalize and scale the features
    normalized_features = (np.array(features) - np.mean(features)) / np.std(features)
    
    # Convert to numpy array
    return np.array(normalized_features, dtype=np.float32)

def generate_design(user_input, model):
    """
    Generates a custom design based on user input
    
    Args:
        user_input (dict): User input containing design preferences
        model (DesignGeneratorModel): Loaded design generator model
    
    Returns:
        np.array: Generated design as a numpy array
    """
    # Preprocess the user input
    preprocessed_input = preprocess_input(user_input)
    
    # Expand dimensions of the input for model compatibility
    model_input = np.expand_dims(preprocessed_input, axis=0)
    
    # Generate design using the model
    generated_design = model.predict(model_input)
    
    return generated_design[0]  # Return the first (and only) generated design

def postprocess_output(generated_design):
    """
    Postprocesses the model output into a usable format
    
    Args:
        generated_design (np.array): Generated design from the model
    
    Returns:
        PIL.Image: Processed design as an image
    """
    # Scale the generated design to pixel values (0-255)
    scaled_design = (generated_design * 255).astype(np.uint8)
    
    # Create a PIL Image from the array
    image = Image.fromarray(scaled_design)
    
    return image

def generate_and_save_design(user_input, user_id):
    """
    Main function to generate a design and save it
    
    Args:
        user_input (dict): User input containing design preferences
        user_id (str): ID of the user requesting the design
    
    Returns:
        str: URL of the saved design
    """
    try:
        # Load the design generator model
        model = load_model()
        
        # Generate a design using the model and user input
        generated_design = generate_design(user_input, model)
        
        # Postprocess the generated design
        processed_image = postprocess_output(generated_design)
        
        # Format the design output
        formatted_design = format_design_output(processed_image, DESIGN_GENERATION_CONFIG)
        
        # Save the generated design
        design_url = save_generated_design(formatted_design, user_id)
        
        return design_url
    except Exception as e:
        # Log the error (implement proper logging)
        print(f"Error in generate_and_save_design: {str(e)}")
        raise