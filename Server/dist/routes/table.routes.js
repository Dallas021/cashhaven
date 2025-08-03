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
const table_service_1 = __importDefault(require("../service/table.service"));
const table = (0, express_1.Router)();
table.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield table_service_1.default.allTables();
    res.status(result.success ? 200 : 500).json(result);
}));
table.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, referencia } = req.body;
    const result = yield table_service_1.default.insertTable(id, referencia);
    res.status(result.success ? 200 : 500).json(result);
}));
table.delete("/dell/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const uid = Number(id);
    const result = yield table_service_1.default.deletTable(uid);
    res.status(result.success ? 200 : 500).json(result);
}));
table.post("/ped/insert", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pedidos = req.body;
    const result = yield table_service_1.default.insertTablePed(pedidos);
    res.status(result.success ? 201 : 500).json(result);
}));
table.get("/ped/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield table_service_1.default.pedTable();
    res.status(result.success ? 200 : 500).json(result);
}));
table.post("/liberar/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield table_service_1.default.cleanTablePed();
    res.status(result.success ? 200 : 500).json(result);
}));
exports.default = table;
