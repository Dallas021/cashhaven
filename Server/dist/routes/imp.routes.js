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
const express_1 = require("express");
const imp_service_1 = __importDefault(require("../service/imp.service"));
const imp = (0, express_1.Router)();
imp.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ip, model } = req.body;
    const result = yield imp_service_1.default.registerImp(ip, model);
    res.status(result.success ? 200 : 500).json(result);
}));
imp.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield imp_service_1.default.allImp();
    res.status(result.success ? 200 : 500).json(result);
}));
imp.get("/all/models", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield imp_service_1.default.allModels();
    res.status(result.success ? 200 : 500).json(result);
}));
imp.get("/primary", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield imp_service_1.default.primaryImp();
    res.status(result.success ? 200 : 500).json(result);
}));
imp.put("/primary/salved", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const result = yield imp_service_1.default.salvaPrimaryImp(id);
    res.status(result.success ? 200 : 500).json(result);
}));
exports.default = imp;
