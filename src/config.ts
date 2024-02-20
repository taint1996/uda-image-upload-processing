import * as fs from 'fs';

const PUBLIC_IMAGES = './public/images/';
const IMAGE_DEFAULTS: string[] = fs
  .readdirSync(PUBLIC_IMAGES, 'utf-8')
  .map((file) => file);

export const config = {
  PUBLIC_IMAGES_PATH: PUBLIC_IMAGES,
  PORT: 8080,
  IMAGE_DEFAULTS: IMAGE_DEFAULTS,
  IMAGES_DIRECTORY_PATH: __dirname + '/public/images/',
  IMAGE_NOT_FOUND: 'not_found.png'
};
