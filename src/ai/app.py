from flask import Flask, request, jsonify
from src.ai.services.styleMatchingService import StyleMatchingService
from src.ai.services.designGenerationService import DesignGenerationService
from src.backend.utils.logger import logger
from src.ai.config import MODEL_PATH_STYLE_MATCHER, MODEL_PATH_DESIGN_GENERATOR

app = Flask(__name__)

style_matching_service = StyleMatchingService(MODEL_PATH_STYLE_MATCHER)
design_generation_service = DesignGenerationService(MODEL_PATH_DESIGN_GENERATOR)

@app.route('/match-style', methods=['POST'])
def match_style():
    try:
        user_preferences = request.json.get('user_preferences')
        matched_style = style_matching_service.match_style(user_preferences)
        recommendations = style_matching_service.get_style_recommendations(user_preferences)
        return jsonify({
            'matched_style': matched_style,
            'recommendations': recommendations
        }), 200
    except Exception as e:
        logger.error(f"Error in match_style: {str(e)}")
        return jsonify({'error': 'An error occurred while matching style'}), 500

@app.route('/generate-design', methods=['POST'])
def generate_design():
    try:
        user_input = request.json.get('user_input')
        style_line = request.json.get('style_line')
        generated_design = design_generation_service.generate_design(user_input, style_line)
        return jsonify({'generated_design': generated_design}), 200
    except Exception as e:
        logger.error(f"Error in generate_design: {str(e)}")
        return jsonify({'error': 'An error occurred while generating design'}), 500

@app.route('/apply-design', methods=['POST'])
def apply_design_to_product():
    try:
        design_base64 = request.json.get('design_base64')
        product_image_path = request.json.get('product_image_path')
        applied_design = design_generation_service.apply_design_to_product(design_base64, product_image_path)
        return jsonify({'applied_design': applied_design}), 200
    except Exception as e:
        logger.error(f"Error in apply_design_to_product: {str(e)}")
        return jsonify({'error': 'An error occurred while applying design to product'}), 500

@app.route('/design-variations', methods=['POST'])
def generate_design_variations():
    try:
        initial_design_base64 = request.json.get('initial_design_base64')
        num_variations = request.json.get('num_variations')
        variations = design_generation_service.generate_design_variations(initial_design_base64, num_variations)
        return jsonify({'variations': variations}), 200
    except Exception as e:
        logger.error(f"Error in generate_design_variations: {str(e)}")
        return jsonify({'error': 'An error occurred while generating design variations'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(debug=False)