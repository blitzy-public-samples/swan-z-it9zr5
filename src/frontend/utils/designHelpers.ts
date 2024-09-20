import { fabric } from 'fabric';
import { Design } from 'src/shared/types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, DESIGN_ELEMENTS } from 'src/shared/constants';

export const initializeCanvas = (canvasId: string): fabric.Canvas => {
  const canvas = new fabric.Canvas(canvasId, {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    selection: true,
    preserveObjectStacking: true,
  });

  canvas.setBackgroundColor('#FFFFFF', canvas.renderAll.bind(canvas));
  return canvas;
};

export const addDesignElement = async (
  canvas: fabric.Canvas,
  elementType: string,
  options: object
): Promise<fabric.Object> => {
  if (!DESIGN_ELEMENTS.hasOwnProperty(elementType)) {
    throw new Error(`Invalid element type: ${elementType}`);
  }

  let element: fabric.Object;

  switch (elementType) {
    case 'rect':
      element = new fabric.Rect(options);
      break;
    case 'circle':
      element = new fabric.Circle(options);
      break;
    case 'text':
      element = new fabric.Text(options.text || 'Text', options);
      break;
    case 'image':
      element = await new Promise((resolve, reject) => {
        fabric.Image.fromURL(options.url, (img) => {
          if (img) {
            img.set(options);
            resolve(img);
          } else {
            reject(new Error('Failed to load image'));
          }
        });
      });
      break;
    default:
      throw new Error(`Unsupported element type: ${elementType}`);
  }

  canvas.add(element);
  canvas.renderAll();
  return element;
};

export const removeDesignElement = (canvas: fabric.Canvas, element: fabric.Object): void => {
  canvas.remove(element);
  canvas.renderAll();
};

export const updateDesignElement = (element: fabric.Object, properties: object): void => {
  element.set(properties);
  element.canvas?.renderAll();
};

export const saveDesign = (canvas: fabric.Canvas): Promise<Design> => {
  return new Promise((resolve) => {
    const designJSON = canvas.toJSON();
    const design: Design = {
      id: Date.now().toString(),
      name: 'Untitled Design',
      createdAt: new Date(),
      updatedAt: new Date(),
      designData: JSON.stringify(designJSON),
    };
    resolve(design);
  });
};

export const loadDesign = (canvas: fabric.Canvas, design: Design): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      canvas.clear();
      canvas.loadFromJSON(JSON.parse(design.designData), () => {
        canvas.renderAll();
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const generateThumbnail = (
  canvas: fabric.Canvas,
  width: number,
  height: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const ctx = tempCanvas.getContext('2d');

      if (!ctx) {
        throw new Error('Failed to get 2D context');
      }

      const scaleFactor = Math.min(width / canvas.width!, height / canvas.height!);
      ctx.scale(scaleFactor, scaleFactor);
      ctx.drawImage(canvas.getElement(), 0, 0);

      resolve(tempCanvas.toDataURL('image/png'));
    } catch (error) {
      reject(error);
    }
  });
};

// TODO: Implement error handling for edge cases in design element manipulation
// TODO: Add unit tests for each utility function
// TODO: Optimize performance for large canvas operations
// TODO: Implement undo/redo functionality for design actions