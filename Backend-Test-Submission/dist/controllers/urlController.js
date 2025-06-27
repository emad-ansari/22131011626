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
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortenUrl = shortenUrl;
exports.getStatistics = getStatistics;
const urlModel_1 = require("../models/urlModel");
const _logger_1 = require("@logger");
function shortenUrl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { originalUrl, validity, shortcode } = req.body;
        if (!originalUrl || typeof originalUrl !== 'string') {
            yield (0, _logger_1.Log)('backend', 'error', 'controller', 'Missing or invalid originalUrl');
            return res.status(400).json({ error: 'originalUrl is required' });
        }
        let code = shortcode;
        if (!code || typeof code !== 'string') {
            code = Math.random().toString(36).substr(2, 6);
        }
        if (urlModel_1.urlStore[code]) {
            yield (0, _logger_1.Log)('backend', 'warn', 'controller', 'Shortcode already exists');
            return res.status(409).json({ error: 'Shortcode already exists' });
        }
        const expiry = new Date(Date.now() + (Number(validity) || 30) * 60000).toISOString();
        urlModel_1.urlStore[code] = { originalUrl, createdAt: new Date().toISOString(), expiry };
        yield (0, _logger_1.Log)('backend', 'info', 'controller', `Shortened URL: ${originalUrl} -> ${code}`);
        res.json({ shortLink: `http://localhost:${process.env.PORT || 8080}/${code}`, expiry });
    });
}
function getStatistics(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = Object.entries(urlModel_1.urlStore).map(([shortcode, data]) => ({
            shortcode,
            shortLink: `http://localhost:${process.env.PORT || 8080}/${shortcode}`,
            originalUrl: data.originalUrl,
            createdAt: data.createdAt,
            expiresAt: data.expiry,
            totalClicks: 0,
            clickData: [],
        }));
        yield (0, _logger_1.Log)('backend', 'info', 'controller', 'Fetched statistics');
        res.json(stats);
    });
}
