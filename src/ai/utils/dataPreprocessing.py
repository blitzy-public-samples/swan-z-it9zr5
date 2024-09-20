import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from PIL import Image
from src.shared.constants.index import StyleLines

def preprocess_user_preferences(user_preferences: pd.DataFrame) -> np.array:
    """
    Preprocesses user preference data for the StyleMatcherModel
    """
    # Remove missing values
    user_preferences = user_preferences.dropna()

    # Convert categorical variables to numerical using one-hot encoding
    categorical_columns = user_preferences.select_dtypes(include=['object']).columns
    user_preferences = pd.get_dummies(user_preferences, columns=categorical_columns)

    # Normalize numerical features using StandardScaler
    scaler = StandardScaler()
    numerical_columns = user_preferences.select_dtypes(include=['float64', 'int64']).columns
    user_preferences[numerical_columns] = scaler.fit_transform(user_preferences[numerical_columns])

    return user_preferences.to_numpy()

def preprocess_style_data(style_data: pd.DataFrame) -> tuple:
    """
    Preprocesses style data for training the StyleMatcherModel
    """
    # Clean the style data by removing duplicates and handling missing values
    style_data = style_data.drop_duplicates().dropna()

    # Extract features (X) and style lines (y) from the data
    X = style_data.drop('style_line', axis=1)
    y = style_data['style_line']

    # Preprocess features using preprocess_user_preferences function
    X_preprocessed = preprocess_user_preferences(X)

    # Encode style lines using encode_style_lines function
    y_encoded = encode_style_lines(y.tolist())

    return X_preprocessed, y_encoded

def preprocess_design_data(design_images: list, style_labels: list) -> tuple:
    """
    Preprocesses design data for the DesignGeneratorModel
    """
    # Normalize image data using normalize_image_data function
    X = normalize_image_data(design_images)

    # Encode style labels using encode_style_lines function
    y = encode_style_lines(style_labels)

    return X, y

def normalize_image_data(images: list) -> np.array:
    """
    Normalizes image data for use in the DesignGeneratorModel
    """
    standard_size = (224, 224)  # Example size, adjust as needed
    normalized_images = []

    for img in images:
        # Convert image to numpy array
        img_array = np.array(Image.open(img).resize(standard_size))
        
        # Normalize pixel values to range [-1, 1]
        img_normalized = (img_array / 127.5) - 1
        
        normalized_images.append(img_normalized)

    return np.array(normalized_images)

def encode_style_lines(style_lines: list) -> np.array:
    """
    Encodes style lines into numerical format
    """
    # Create a mapping of style lines to numerical values
    style_mapping = {style: i for i, style in enumerate(StyleLines)}

    # Convert style lines to numerical values using the mapping
    encoded_styles = [style_mapping[style] for style in style_lines]

    # Perform one-hot encoding on the numerical values
    one_hot_encoded = np.eye(len(StyleLines))[encoded_styles]

    return one_hot_encoded

# TODO: Implement data validation checks for input data in each preprocessing function
# TODO: Add support for handling outliers in numerical data
# TODO: Implement feature scaling techniques other than StandardScaler (e.g., MinMaxScaler) and allow for easy switching
# TODO: Add functionality to handle imbalanced datasets in style data preprocessing
# TODO: Implement data augmentation techniques for design images to increase dataset diversity
# TODO: Add support for preprocessing text data (e.g., design descriptions) if needed
# TODO: Implement caching mechanism for preprocessed data to improve performance
# TODO: Add unit tests for each preprocessing function
# TODO: Optimize image preprocessing for large datasets, possibly using parallel processing
# TODO: Implement logging for preprocessing steps and any data quality issues encountered