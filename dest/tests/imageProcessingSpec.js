"use strict";
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
const imageProcessing_1 = __importDefault(require("../utils/imageProcessing"));
describe('ImageProcessing Test', () => {
    const imageProcessing = new imageProcessing_1.default();
    describe('renderImage function', () => __awaiter(void 0, void 0, void 0, function* () {
        it('getImgFilePath test.png', () => __awaiter(void 0, void 0, void 0, function* () {
            const image = yield imageProcessing.getImgFilePath('test.png');
            expect(image).toContain('undefined');
        }));
        it('getImgFilePath fjord.jpg', () => __awaiter(void 0, void 0, void 0, function* () {
            const image = yield imageProcessing.getImgFilePath('fjord.jpg');
            expect(image).toContain(imageProcessing.getImgFilePath('fjord.jpg'));
        }));
        it('renderImg fjord.jpg', () => __awaiter(void 0, void 0, void 0, function* () {
            const image = yield imageProcessing.getImgFilePath('fjord.jpg');
            expect(image).toContain('fjord.jpg');
            const isExistedImg = yield imageProcessing.isExistImg('fjord.jpg');
            expect(isExistedImg).toBe(true);
            const render = yield imageProcessing.renderImg('fjord.jpg', 200, 200);
            expect(render === null || render === void 0 ? void 0 : render.width).toBe(200);
            expect(render === null || render === void 0 ? void 0 : render.height).toBe(200);
        }));
        it('renderImg with size 200x200 which is filename does not exist in Directory', () => __awaiter(void 0, void 0, void 0, function* () {
            const image = yield imageProcessing.getImgFilePath('fjord123.jpg');
            expect(image).toContain('undefined');
            const isExistedImg = yield imageProcessing.isExistImg('fjord123.jpg');
            expect(isExistedImg).toBe(false);
            const render = yield imageProcessing.renderImg('fjord123.jpg', 200, 200);
            expect(render === null || render === void 0 ? void 0 : render.format).toBeUndefined();
            expect(render === null || render === void 0 ? void 0 : render.width).toBeNull();
            expect(render === null || render === void 0 ? void 0 : render.height).toBeNull();
        }));
        it('renderImg with size 200x200 and input width < 50 pixels', () => __awaiter(void 0, void 0, void 0, function* () {
            const image = yield imageProcessing.getImgFilePath('fjord.jpg');
            expect(image).toContain('fjord.jpg');
            const isExistedImg = yield imageProcessing.isExistImg('fjord.jpg');
            expect(isExistedImg).toBe(true);
            const render = yield imageProcessing.renderImg('fjord.jpg', 10, 200);
            expect(render).toBeUndefined();
        }));
        it('renderImg with img=fjord', () => __awaiter(void 0, void 0, void 0, function* () {
            const image = yield imageProcessing.getImgFilePath('fjord');
            expect(image).toContain('undefined');
            const isExistedImg = yield imageProcessing.isExistImg('fjord');
            expect(isExistedImg).toBe(false);
            const render = yield imageProcessing.renderImg('fjord', 200, 200);
            expect(render === null || render === void 0 ? void 0 : render.format).toBeUndefined();
            expect(render === null || render === void 0 ? void 0 : render.width).toBeNull();
            expect(render === null || render === void 0 ? void 0 : render.height).toBeNull();
            const renderNotFoundImg = yield imageProcessing.renderImg('not_found.png', 200, 200);
            expect(renderNotFoundImg === null || renderNotFoundImg === void 0 ? void 0 : renderNotFoundImg.width).toBe(200);
            expect(renderNotFoundImg === null || renderNotFoundImg === void 0 ? void 0 : renderNotFoundImg.height).toBe(200);
        }));
        it('scaleImage fjord.jpg', () => __awaiter(void 0, void 0, void 0, function* () {
            const image = yield imageProcessing.getImgFilePath('fjord.jpg');
            expect(image).toContain('fjord.jpg');
            const isExistedImg = yield imageProcessing.isExistImg('fjord.jpg');
            expect(isExistedImg).toBe(true);
            const size = imageProcessing.getSizeNumValue('s');
            expect(size).toBeGreaterThan(0);
            const render = yield imageProcessing.scaleImage('fjord.jpg', 's');
            expect(render.format).toBe('png');
        }));
        it('scaleImage fjord.jpg with size = abc', () => __awaiter(void 0, void 0, void 0, function* () {
            const image = yield imageProcessing.getImgFilePath('fjord.jpg');
            expect(image).toContain('fjord.jpg');
            const isExistedImg = yield imageProcessing.isExistImg('fjord.jpg');
            expect(isExistedImg).toBe(true);
            const size = imageProcessing.getSizeNumValue('abc');
            expect(size).toBe(0);
            const render = yield imageProcessing.scaleImage('fjord.jpg', 'abc');
            expect(render === null || render === void 0 ? void 0 : render.format).toBeUndefined();
            expect(render === null || render === void 0 ? void 0 : render.width).toBeNull();
            expect(render === null || render === void 0 ? void 0 : render.height).toBeNull();
        }));
        it('scaleImg with img=fjord', () => __awaiter(void 0, void 0, void 0, function* () {
            const image = yield imageProcessing.getImgFilePath('fjord');
            expect(image).toContain('undefined');
            const isExistedImg = yield imageProcessing.isExistImg('fjord');
            expect(isExistedImg).toBe(false);
            const render = yield imageProcessing.scaleImage('fjord', 's');
            expect(render === null || render === void 0 ? void 0 : render.format).toBeUndefined();
            expect(render === null || render === void 0 ? void 0 : render.width).toBeNull();
            expect(render === null || render === void 0 ? void 0 : render.height).toBeNull();
            const renderNotFoundImg = yield imageProcessing.scaleImage('not_found.png', 'm');
            expect(renderNotFoundImg === null || renderNotFoundImg === void 0 ? void 0 : renderNotFoundImg.format).toBe('png');
        }));
    }));
});
