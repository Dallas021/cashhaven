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
const auth_service_1 = __importDefault(require("../service/auth.service"));
const auth = (0, express_1.Router)();
auth.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usuario, senha } = req.body;
    const result = yield auth_service_1.default.loginUser(usuario, senha);
    if (result.code === 404) {
        res.status(404).json(result);
    }
    res.status(result.success ? 200 : 500).json(result);
}));
auth.post("/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    const result = yield auth_service_1.default.registerUser(userData);
    res.status(result.success ? 201 : 500).json(result);
}));
exports.default = auth;
