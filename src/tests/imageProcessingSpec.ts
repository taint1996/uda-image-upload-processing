import ImageProcessing from '../utils/imageProcessing';

describe('ImageProcessing Test', () => {
  const imageProcessing = new ImageProcessing();

  describe('renderImage function', async () => {
    it('getImgFilePath test.png', async () => {
      const image = await imageProcessing.getImgFilePath('test.png');
      expect(image).toContain('undefined');
    });

    it('getImgFilePath fjord.jpg', async () => {
      const image = await imageProcessing.getImgFilePath('fjord.jpg');
      expect(image).toContain(imageProcessing.getImgFilePath('fjord.jpg'));
    });

    it('renderImg fjord.jpg', async () => {
      const image = await imageProcessing.getImgFilePath('fjord.jpg');
      expect(image).toContain('fjord.jpg');

      const isExistedImg = await imageProcessing.isExistImg('fjord.jpg');
      expect(isExistedImg).toBe(true);
      const render = await imageProcessing.renderImg('fjord.jpg', 200, 200);
      expect(render?.width).toBe(200);
      expect(render?.height).toBe(200);
    });

    it('renderImg with size 200x200 which is filename does not exist in Directory', async () => {
      const image = await imageProcessing.getImgFilePath('fjord123.jpg');
      expect(image).toContain('undefined');

      const isExistedImg = await imageProcessing.isExistImg('fjord123.jpg');
      expect(isExistedImg).toBe(false);

      const render = await imageProcessing.renderImg('fjord123.jpg', 200, 200);
      expect(render?.format).toBeUndefined();
      expect(render?.width).toBeNull();
      expect(render?.height).toBeNull();
    });

    it('renderImg with size 200x200 and input width < 50 pixels', async () => {
      const image = await imageProcessing.getImgFilePath('fjord.jpg');
      expect(image).toContain('fjord.jpg');

      const isExistedImg = await imageProcessing.isExistImg('fjord.jpg');
      expect(isExistedImg).toBe(true);

      const render = await imageProcessing.renderImg('fjord.jpg', 10, 200);
      expect(render).toBeUndefined();
    });

    it('renderImg with img=fjord', async () => {
      const image = await imageProcessing.getImgFilePath('fjord');
      expect(image).toContain('undefined');

      const isExistedImg = await imageProcessing.isExistImg('fjord');
      expect(isExistedImg).toBe(false);

      const render = await imageProcessing.renderImg('fjord', 200, 200);
      expect(render?.format).toBeUndefined();
      expect(render?.width).toBeNull();
      expect(render?.height).toBeNull();

      const renderNotFoundImg = await imageProcessing.renderImg('not_found.png', 200, 200);
      expect(renderNotFoundImg?.width).toBe(200);
      expect(renderNotFoundImg?.height).toBe(200);
    });

    it('scaleImage fjord.jpg', async () => {
      const image = await imageProcessing.getImgFilePath('fjord.jpg');
      expect(image).toContain('fjord.jpg');

      const isExistedImg = await imageProcessing.isExistImg('fjord.jpg');
      expect(isExistedImg).toBe(true);

      const size = imageProcessing.getSizeNumValue('s');
      expect(size).toBeGreaterThan(0);

      const render = await imageProcessing.scaleImage('fjord.jpg', 's');
      expect(render.format).toBe('png');
    });

    it('scaleImage fjord.jpg with size = abc', async () => {
      const image = await imageProcessing.getImgFilePath('fjord.jpg');
      expect(image).toContain('fjord.jpg');

      const isExistedImg = await imageProcessing.isExistImg('fjord.jpg');
      expect(isExistedImg).toBe(true);

      const size = imageProcessing.getSizeNumValue('abc');
      expect(size).toBe(0);

      const render = await imageProcessing.scaleImage('fjord.jpg', 'abc');
      expect(render?.format).toBeUndefined();
      expect(render?.width).toBeNull();
      expect(render?.height).toBeNull();
    });

    it('scaleImg with img=fjord', async () => {
      const image = await imageProcessing.getImgFilePath('fjord');
      expect(image).toContain('undefined');

      const isExistedImg = await imageProcessing.isExistImg('fjord');
      expect(isExistedImg).toBe(false);

      const render = await imageProcessing.scaleImage('fjord', 's');
      expect(render?.format).toBeUndefined();
      expect(render?.width).toBeNull();
      expect(render?.height).toBeNull();

      const renderNotFoundImg = await imageProcessing.scaleImage('not_found.png', 'm');
      expect(renderNotFoundImg?.format).toBe('png');
    });
  });
});
