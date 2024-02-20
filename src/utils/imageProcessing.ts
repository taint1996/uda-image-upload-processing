import sharp from 'sharp';
import { config } from '../config';
import * as fs from 'fs';

import { Response } from 'express';

interface SharpRendering {
  format: string;
  width: number;
  height: number;
  channels: number;
  premultiplied: boolean;
  size: number;
}

export default class ImageProcessing {
  isExistImg(imgFile: string): boolean {
    return fs.existsSync(`${config.PUBLIC_IMAGES_PATH}/${imgFile}`);
  }

  defaultSharpRendering() {
    return {
      format: undefined,
      width: null,
      height: null,
      channels: null,
      premultiplied: false,
      size: null
    };
  }

  getImgFilePath(imgFile: string): string {
    const filePath = fs
      .readdirSync(config.PUBLIC_IMAGES_PATH, 'utf-8')
      .find((file: string) => file == imgFile);
    return filePath == undefined
      ? 'undefined'
      : config.PUBLIC_IMAGES_PATH + filePath;
  }

  removeMimeType(imgFile: string): string {
    return config.PUBLIC_IMAGES_PATH + imgFile.slice(16, -4); // remove memetype such as .jpg | .png
  }

  async renderImg(imgFile: string, w: number, h: number) {
    if (!this.isExistImg(imgFile)) return this.defaultSharpRendering();
    
    if (this.isExistImg(imgFile) && w >= 50 && h >= 50)
      return await sharp(this.getImgFilePath(imgFile))
        .resize({ width: w, height: h })
        .toFile(
          `${this.removeMimeType(this.getImgFilePath(imgFile))}_${w}x${h}.png`
        );
  }

  getSizeNumValue(size: string): number {
    let sizeNum: number;

    switch (size) {
      case 'small':
      case 's':
        sizeNum = 0.3;
        break;
      case 'medium':
      case 'm':
        sizeNum = 0.5;
        break;
      case 'full':
      case 'max':
      case 'l':
        sizeNum = 1;
        break;
      default:
        sizeNum = 0;
    }
    return sizeNum;
  }

  async resizedImage(
    imgFile: string,
    width: number,
    height: number,
    res: Response
  ) {
    await sharp(imgFile)
      .resize(width, height)
      .png()
      .toBuffer()
      .then((data) => res.type('png').send(data));
  }

  async scaleImage(imgFile: string, size: string) {
    const REGEX_IMG_FILE = /^[A-Za-z0-9]*(.)(png|jpg)/i;
    const sizeNum = this.getSizeNumValue(size);

    if (!REGEX_IMG_FILE.test(imgFile)) {
      await sharp(config.PUBLIC_IMAGES_PATH + config.IMAGE_NOT_FOUND)
        .metadata()
        .then(async ({ width, height }) => {
          return sharp(config.PUBLIC_IMAGES_PATH + config.IMAGE_NOT_FOUND)
            .resize({
              width: width ? Math.round(width * sizeNum) : 200,
              height: height ? Math.round(height * sizeNum) : 200
            })
            .toFile(
              `${
                config.PUBLIC_IMAGES_PATH + config.IMAGE_NOT_FOUND
              }-scale-to-${size}.png`
            );
        });
    }

    if (
      !this.isExistImg(imgFile) ||
      /^(small|medium|large|full|max|s|m|l)$/.test(size) == false
    )
      return this.defaultSharpRendering();

    return await sharp(this.getImgFilePath(imgFile))
      .metadata()
      .then(async ({ width, height }) => {
        return sharp(this.getImgFilePath(imgFile))
          .resize({
            width: width ? Math.round(width * sizeNum) : 200,
            height: height ? Math.round(height * sizeNum) : 200
          })
          .toFile(
            `${this.removeMimeType(
              this.getImgFilePath(imgFile)
            )}-scale-to-${size}.png`
          );
      });
  }
}
