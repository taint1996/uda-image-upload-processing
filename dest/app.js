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
const express_1 = __importDefault(require("express"));
const fs = __importStar(require("fs"));
const config_1 = require("./config");
const path_1 = __importDefault(require("path"));
const imageProcessing_1 = __importDefault(require("./utils/imageProcessing"));
const sharp_1 = __importDefault(require("sharp"));
const app = (0, express_1.default)();
const IMAGE_DEFAULTS = config_1.config.IMAGE_DEFAULTS;
const port = config_1.config.PORT;
app.get('/', (req, res, next) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const myHTML = fs.readFileSync('./public/views/index.html');
    res.end(myHTML);
});
app.get('/api/images', (req, res, next) => {
    try {
        res.status(200).json({
            images: IMAGE_DEFAULTS,
            message: `Get all filename images`
        });
    }
    catch (err) {
        res.json({
            images: [],
            message: err
        });
    }
});
app.get('/api/img/:img', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const width = req.param('w');
    const height = req.param('h');
    const size = req.param('s') ? req.param('s') : '';
    const imgParam = req.params.img;
    const existImg = fs.existsSync(`${config_1.config.PUBLIC_IMAGES_PATH}/${imgParam}`);
    const widthNum = width ? parseInt(width) : 0;
    const heightNum = height ? parseInt(height) : 0;
    const imageProcessing = new imageProcessing_1.default();
    const REGEX_IMG_FILE = /^[A-Za-z0-9]*(.)(png|jpg)/i;
    const imgFileName = REGEX_IMG_FILE.test(imgParam)
        ? imgParam.split('.')[0]
        : imgParam;
    const getImageFilePath = imageProcessing.getImgFilePath(imgParam);
    try {
        if ((imgFileName && !existImg) || widthNum > 2048 || heightNum > 2048 || (/^[0-9]*$/).test(width) == false || !(/^[0-9]*$/).test(height) == false) {
            yield imageProcessing.renderImg(config_1.config.IMAGE_NOT_FOUND, 200, 200);
            res.status(404).send({
                message: "The image filename is invalid. However, We'll save an not_found image into folder images.",
                images: config_1.config.IMAGE_DEFAULTS
            });
            return;
        }
        switch (existImg) {
            case /^(small|medium|large|full|max|s|m|l)$/.test(size):
                imageProcessing.scaleImage(imgParam, size);
                const sizeNum = imageProcessing.getSizeNumValue(size);
                const metadata = yield (0, sharp_1.default)(getImageFilePath).metadata();
                if (Object.keys(metadata).length > 0) {
                    const widthImg = (metadata === null || metadata === void 0 ? void 0 : metadata.width) ? metadata.width * sizeNum : 512 * sizeNum;
                    const heightImg = (metadata === null || metadata === void 0 ? void 0 : metadata.height) ? metadata.height * sizeNum : 512 * sizeNum;
                    yield imageProcessing.resizedImage(getImageFilePath, widthImg, heightImg, res);
                }
                break;
            case widthNum >= 50 &&
                heightNum >= 50 &&
                widthNum <= 2048 &&
                heightNum <= 2048 &&
                imageProcessing.isExistImg(imgParam):
                yield imageProcessing.resizedImage(getImageFilePath, widthNum, heightNum, res);
                break;
            case width == undefined || height == undefined:
            case size == '':
                const renderImg200x200 = yield imageProcessing.renderImg(imgParam, 200, 200);
                res.status(200).send({
                    message: `Get image ${imgFileName}_200x200.${renderImg200x200 === null || renderImg200x200 === void 0 ? void 0 : renderImg200x200.format} width default size 200x200`
                });
                break;
            default: {
                yield imageProcessing.renderImg(config_1.config.IMAGE_NOT_FOUND, 200, 200);
                res.status(400).send({
                    message: `Invalid size of width/height. Please input image filename like 1 of field images and width - height must be >= 50 pixels and upto 2048pixels or size = small | medium | full | max`,
                    images: config_1.config.IMAGE_DEFAULTS
                });
                return;
            }
        }
    }
    catch (err) {
        res.json({
            message: `Error: ${err}`,
            images: []
        });
    }
}));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.listen(port, () => {
    console.log(`Listening on port ${port}...!`);
});
