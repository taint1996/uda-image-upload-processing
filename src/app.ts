import express, { Request, Response, NextFunction, Application } from 'express';

import * as fs from 'fs';
import { config } from './config';
import path from 'path';
import ImageProcessing from './utils/imageProcessing';
import sharp from 'sharp';

const app: Application = express();
let IMAGE_DEFAULTS = config.IMAGE_DEFAULTS;
const port = config.PORT;

app.get('/', (req: Request, res: Response, next: NextFunction): void => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  const myHTML = fs.readFileSync('./public/views/index.html');
  res.end(myHTML);
});

app.get(
  '/api/images',
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.status(200).json({
        images: IMAGE_DEFAULTS,
        message: `Get all filename images`
      });
    } catch (err) {
      res.json({
        images: [],
        message: err
      });
    }
  }
);

app.get(
  '/api/img/:img',
  async (req: Request, res: Response, next: NextFunction) => {
    const width: string = req.param('w');
    const height: string = req.param('h');
    const size: string = req.param('s') ? req.param('s') : '';

    const imgParam: string = req.params.img;
    const existImg: boolean = fs.existsSync(
      `${config.PUBLIC_IMAGES_PATH}/${imgParam}`
    );

    const widthNum: number = width ? parseInt(width) : 0;
    const heightNum: number = height ? parseInt(height) : 0;

    const imageProcessing = new ImageProcessing();

    const REGEX_IMG_FILE = /^[A-Za-z0-9]*(.)(png|jpg)/i;
    const imgFileName = REGEX_IMG_FILE.test(imgParam)
      ? imgParam.split('.')[0]
      : imgParam;

    const getImageFilePath = imageProcessing.getImgFilePath(imgParam)

    try {
      if ((imgFileName && !existImg) || widthNum > 2048 || heightNum > 2048 || (/^[0-9]*$/).test(width) == false || !(/^[0-9]*$/).test(height) == false) {
        await imageProcessing.renderImg(config.IMAGE_NOT_FOUND, 200, 200);

        res.status(404).send({
          message:
            "The image filename is invalid. However, We'll save an not_found image into folder images.",
          images: config.IMAGE_DEFAULTS
        });

        return;
      }

      switch (existImg) {
        case /^(small|medium|large|full|max|s|m|l)$/.test(size):
          imageProcessing.scaleImage(imgParam, size);
          const sizeNum = imageProcessing.getSizeNumValue(size);

          const metadata = await sharp(getImageFilePath).metadata();
          if (Object.keys(metadata).length > 0) {
            const widthImg = metadata?.width ? metadata.width * sizeNum : 512 * sizeNum;
            const heightImg = metadata?.height ? metadata.height * sizeNum : 512 * sizeNum;

            await imageProcessing.resizedImage(getImageFilePath, widthImg, heightImg, res)
          }

          break;
        case widthNum >= 50 &&
          heightNum >= 50 &&
          widthNum <= 2048 &&
          heightNum <= 2048 &&
          imageProcessing.isExistImg(imgParam):

          await imageProcessing.resizedImage(getImageFilePath, widthNum, heightNum, res)
          break;
        case width == undefined || height == undefined:
        case size == '':
          const renderImg200x200 = await imageProcessing.renderImg(
            imgParam,
            200,
            200
          );
          res.status(200).send({
            message: `Get image ${imgFileName}_200x200.${renderImg200x200?.format} width default size 200x200`
          });

          break;
        default: {
          await imageProcessing.renderImg(config.IMAGE_NOT_FOUND, 200, 200);
          res.status(400).send({
            message: `Invalid size of width/height. Please input image filename like 1 of field images and width - height must be >= 50 pixels and upto 2048pixels or size = small | medium | full | max`,
            images: config.IMAGE_DEFAULTS
          });
          return;
        }
      }
    } catch (err) {
      res.json({
        message: `Error: ${err}`,
        images: []
      });
    }
  }
);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Listening on port ${port}...!`);
});
