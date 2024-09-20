import axios from 'axios';
import { StyleMatcherResponse, DesignGeneratorResponse, StylePreferences, DesignParameters } from 'src/shared/types';
import { logger } from 'src/backend/utils/logger';
import { AI_SERVICE_URL } from 'src/shared/constants';

export class AIService {
  private static instance: AIService;

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public async getStyleRecommendations(preferences: StylePreferences): Promise<StyleMatcherResponse> {
    try {
      logger.info('Fetching style recommendations', { preferences });
      const response = await axios.post(`${AI_SERVICE_URL}/style-matcher`, preferences);
      return response.data;
    } catch (error) {
      logger.error('Error fetching style recommendations', { error });
      throw new Error('Failed to fetch style recommendations');
    }
  }

  public async generateCustomDesign(params: DesignParameters): Promise<DesignGeneratorResponse> {
    try {
      logger.info('Generating custom design', { params });
      const response = await axios.post(`${AI_SERVICE_URL}/design-generator`, params);
      return response.data;
    } catch (error) {
      logger.error('Error generating custom design', { error });
      throw new Error('Failed to generate custom design');
    }
  }

  public validateStylePreferences(preferences: StylePreferences): boolean {
    try {
      // Implement validation logic here
      const requiredFields = ['color', 'style', 'occasion']; // Example required fields
      const isValid = requiredFields.every(field => field in preferences);

      if (!isValid) {
        logger.warn('Invalid style preferences', { preferences });
      }

      return isValid;
    } catch (error) {
      logger.error('Error validating style preferences', { error });
      return false;
    }
  }

  public validateDesignParameters(params: DesignParameters): boolean {
    try {
      // Implement validation logic here
      const requiredFields = ['productType', 'color', 'pattern']; // Example required fields
      const isValid = requiredFields.every(field => field in params);

      if (!isValid) {
        logger.warn('Invalid design parameters', { params });
      }

      return isValid;
    } catch (error) {
      logger.error('Error validating design parameters', { error });
      return false;
    }
  }
}

export const aiService = AIService.getInstance();