import numpy as np
import pandas as pd
from src.ai.models.styleMatcherModel import StyleMatcherModel
from src.shared.constants.index import StyleLines
from src.backend.utils.logger import logger

class StyleMatchingService:
    def __init__(self, model_path: str):
        """
        Initializes the StyleMatchingService.

        Args:
            model_path (str): Path to the pre-trained StyleMatcherModel.
        """
        self.model = StyleMatcherModel()
        self.model.load_model(model_path)
        logger.info(f"StyleMatcherModel loaded successfully from {model_path}")

    def match_style(self, user_preferences: dict) -> str:
        """
        Matches user preferences to a style line.

        Args:
            user_preferences (dict): User's style preferences.

        Returns:
            str: Matched style line.
        """
        try:
            # Preprocess user preferences into a numpy array
            preferences_array = np.array(list(user_preferences.values())).reshape(1, -1)
            
            # Use the StyleMatcherModel to predict the style line
            predicted_style = self.model.predict_style_line(preferences_array)
            
            return predicted_style
        except Exception as e:
            logger.error(f"Error in match_style: {str(e)}")
            raise

    def get_style_recommendations(self, user_preferences: dict, num_recommendations: int) -> list:
        """
        Generates style recommendations based on user preferences.

        Args:
            user_preferences (dict): User's style preferences.
            num_recommendations (int): Number of recommendations to return.

        Returns:
            list: List of recommended style lines with scores.
        """
        try:
            # Preprocess user preferences into a numpy array
            preferences_array = np.array(list(user_preferences.values())).reshape(1, -1)
            
            # Use the StyleMatcherModel to predict style line probabilities
            style_probabilities = self.model.predict_style_probabilities(preferences_array)
            
            # Sort style lines by probability scores
            style_recommendations = sorted(
                zip(StyleLines, style_probabilities[0]),
                key=lambda x: x[1],
                reverse=True
            )
            
            # Return top N recommendations with scores
            return style_recommendations[:num_recommendations]
        except Exception as e:
            logger.error(f"Error in get_style_recommendations: {str(e)}")
            raise

    def update_user_preferences(self, new_preferences: pd.DataFrame, new_style_lines: pd.DataFrame) -> None:
        """
        Updates the style matching model with new user preference data.

        Args:
            new_preferences (pd.DataFrame): New user preference data.
            new_style_lines (pd.DataFrame): Corresponding style lines for the new preferences.

        Returns:
            None
        """
        try:
            # Validate input data
            if len(new_preferences) != len(new_style_lines):
                raise ValueError("new_preferences and new_style_lines must have the same length")

            # Preprocess new preference data
            X = new_preferences.values
            y = new_style_lines.values.ravel()

            # Retrain the StyleMatcherModel with new data
            self.model.train(X, y)

            # Log the model update process
            logger.info(f"StyleMatcherModel updated with {len(new_preferences)} new data points")

            # Save the updated model
            self.model.save_model(self.model.model_path)
            logger.info(f"Updated StyleMatcherModel saved to {self.model.model_path}")
        except Exception as e:
            logger.error(f"Error in update_user_preferences: {str(e)}")
            raise