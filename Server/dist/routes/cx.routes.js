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
const cx_service_1 = __importDefault(require("../service/cx.service"));
const cx = (0, express_1.Router)();
cx.get("/validate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { user_cx } = req.query;
    if (Array.isArray(user_cx)) {
        user_cx = user_cx[0];
    }
    if (typeof user_cx !== "string") {
        res.status(400).json({ success: false, error: "Parâmetro user_cx inválido" });
        return;
    }
    const userCxNumber = Number(user_cx);
    if (isNaN(userCxNumber)) {
        res.status(400).json({ success: false, error: "Parâmetro user_cx deve ser numérico" });
        return;
    }
    const result = yield cx_service_1.default.getCx(userCxNumber);
    res.status(result.success ? 200 : 500).json(result);
}));
cx.post("/open", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_cx, dinheiro } = req.body;
    const result = yield cx_service_1.default.openCx(user_cx, dinheiro);
    if (result.code === 409) {
        res.status(409).json(result);
    }
    res.status(result.success ? 200 : 500).json(result);
}));
cx.post("/forceopen", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_cx, dinheiro } = req.body;
    const result = yield cx_service_1.default.forceOpenCx(user_cx, dinheiro);
    if (result.code == 404) {
        res.status(404).json(result);
    }
    res.status(result.success ? 200 : 500).json(result);
}));
cx.post("/close", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_cx, credito, debito, pix, dinheiro, fcx, vsang, trnc, abertura } = req.body;
    const result = yield cx_service_1.default.closeCx(user_cx, credito, debito, pix, dinheiro, fcx, vsang, trnc, abertura);
    res.status(result.success ? 200 : 500).json(result);
}));
cx.post("/sangria", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_cx, sang, sd_old } = req.body;
    const result = yield cx_service_1.default.withdrawing(user_cx, sang, sd_old);
    if (result.code == "SALDO_INSUFICIENTE") {
        res.status(422).json(result);
    }
    else if (result.code == "ADMIN_SANGRIA") {
        res.status(403).json(result);
    }
    res.status(result.success ? 200 : 500).json(result);
}));
exports.default = cx;
