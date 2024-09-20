import numpy as np
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
import tensorflow as tf
from src.shared.constants.index import StyleLines
from src.backend.utils.logger import logger

def evaluate_style_matcher(model, X_test, y_test):
    """
    Evaluates the performance of the StyleMatcherModel.

    Args:
        model (object): The StyleMatcherModel instance.
        X_test (np.array): Test input data.
        y_test (np.array): True labels for test data.

    Returns:
        dict: Evaluation metrics including accuracy, precision, recall, and F1-score.
    """
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted')

    metrics = {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1_score': f1
    }

    logger.info(f"StyleMatcherModel Evaluation Results: {metrics}")
    return metrics

def evaluate_design_generator(model, test_data, num_samples):
    """
    Evaluates the performance of the DesignGeneratorModel.

    Args:
        model (object): The DesignGeneratorModel instance.
        test_data (np.array): Test input data.
        num_samples (int): Number of samples to generate for evaluation.

    Returns:
        dict: Evaluation metrics including Inception Score and FID.
    """
    generated_designs = model.generate(num_samples)
    inception_score = calculate_inception_score(generated_designs)
    fid = calculate_fid(generated_designs, test_data)

    metrics = {
        'inception_score': inception_score,
        'fid': fid
    }

    logger.info(f"DesignGeneratorModel Evaluation Results: {metrics}")
    return metrics

def plot_confusion_matrix(y_true, y_pred):
    """
    Plots a confusion matrix for the StyleMatcherModel.

    Args:
        y_true (np.array): True labels.
        y_pred (np.array): Predicted labels.

    Returns:
        None: Displays the confusion matrix plot.
    """
    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.title('Confusion Matrix')
    plt.xticks(range(len(StyleLines)), StyleLines, rotation=45)
    plt.yticks(range(len(StyleLines)), StyleLines, rotation=45)
    plt.tight_layout()
    plt.show()

def plot_generated_designs(generated_designs, grid_size):
    """
    Plots a grid of generated designs from the DesignGeneratorModel.

    Args:
        generated_designs (np.array): Array of generated designs.
        grid_size (int): Size of the grid (e.g., 4 for a 4x4 grid).

    Returns:
        None: Displays the grid of generated designs.
    """
    fig, axes = plt.subplots(grid_size, grid_size, figsize=(15, 15))
    for i, ax in enumerate(axes.flat):
        if i < len(generated_designs):
            ax.imshow(generated_designs[i])
            ax.axis('off')
    plt.tight_layout()
    plt.show()

def calculate_inception_score(generated_designs, num_splits=10):
    """
    Calculates the Inception Score for generated designs.

    Args:
        generated_designs (np.array): Array of generated designs.
        num_splits (int): Number of splits for calculating the score.

    Returns:
        float: Inception Score.
    """
    # Load pre-trained Inception model
    inception_model = tf.keras.applications.InceptionV3(include_top=False, pooling='avg', input_shape=(299, 299, 3))

    # Preprocess generated designs
    processed_designs = tf.keras.applications.inception_v3.preprocess_input(generated_designs)

    # Get predictions
    preds = inception_model.predict(processed_designs)

    # Calculate the mean KL-divergence
    scores = []
    for i in range(num_splits):
        part = preds[i * (len(generated_designs) // num_splits): (i + 1) * (len(generated_designs) // num_splits), :]
        kl = part * (np.log(part) - np.log(np.expand_dims(np.mean(part, 0), 0)))
        kl = np.mean(np.sum(kl, 1))
        scores.append(np.exp(kl))

    return np.mean(scores), np.std(scores)

def calculate_fid(generated_designs, real_designs):
    """
    Calculates the Fréchet Inception Distance (FID) between generated and real designs.
    
    This is a placeholder function and needs to be implemented.
    """
    # TODO: Implement FID calculation
    return 0.0