"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
const config_1 = require("../config");
const fs = __importStar(require("fs"));
class ImageProcessing {
    isExistImg(imgFile) {
        return fs.existsSync(`${config_1.config.PUBLIC_IMAGES_PATH}/${imgFile}`);
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
    getImgFilePath(imgFile) {
        const filePath = fs
            .readdirSync(config_1.config.PUBLIC_IMAGES_PATH, 'utf-8')
            .find((file) => file == imgFile);
        return filePath == undefined
            ? 'undefined'
            : config_1.config.PUBLIC_IMAGES_PATH + filePath;
    }
    removeMimeType(imgFile) {
        return config_1.config.PUBLIC_IMAGES_PATH + imgFile.slice(16, -4); // remove memetype such as .jpg | .png
    }
    renderImg(imgFile, w, h) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isExistImg(imgFile))
                return this.defaultSharpRendering();
            if (this.isExistImg(imgFile) && w >= 50 && h >= 50)
                return yield (0, sharp_1.default)(this.getImgFilePath(imgFile))
                    .resize({ width: w, height: h })
                    .toFile(`${this.removeMimeType(this.getImgFilePath(imgFile))}_${w}x${h}.png`);
        });
    }
    getSizeNumValue(size) {
        let sizeNum;
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
    resizedImage(imgFile, width, height, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, sharp_1.default)(imgFile)
                .resize(width, height)
                .png()
                .toBuffer()
                .then((data) => res.type('png').send(data));
        });
    }
    scaleImage(imgFile, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const REGEX_IMG_FILE = /^[A-Za-z0-9]*(.)(png|jpg)/i;
            const sizeNum = this.getSizeNumValue(size);
            if (!REGEX_IMG_FILE.test(imgFile)) {
                yield (0, sharp_1.default)(config_1.config.PUBLIC_IMAGES_PATH + config_1.config.IMAGE_NOT_FOUND)
                    .metadata()
                    .then(({ width, height }) => __awaiter(this, void 0, void 0, function* () {
                    return (0, sharp_1.default)(config_1.config.PUBLIC_IMAGES_PATH + config_1.config.IMAGE_NOT_FOUND)
                        .resize({
                        width: width ? Math.round(width * sizeNum) : 200,
                        height: height ? Math.round(height * sizeNum) : 200
                    })
                        .toFile(`${config_1.config.PUBLIC_IMAGES_PATH + config_1.config.IMAGE_NOT_FOUND}-scale-to-${size}.png`);
                }));
            }
            if (!this.isExistImg(imgFile) ||
                /^(small|medium|large|full|max|s|m|l)$/.test(size) == false)
                return this.defaultSharpRendering();
            return yield (0, sharp_1.default)(this.getImgFilePath(imgFile))
                .metadata()
                .then(({ width, height }) => __awaiter(this, void 0, void 0, function* () {
                return (0, sharp_1.default)(this.getImgFilePath(imgFile))
                    .resize({
                    width: width ? Math.round(width * sizeNum) : 200,
                    height: height ? Math.round(height * sizeNum) : 200
                })
                    .toFile(`${this.removeMimeType(this.getImgFilePath(imgFile))}-scale-to-${size}.png`);
            }));
        });
    }
}
exports.default = ImageProcessing;
