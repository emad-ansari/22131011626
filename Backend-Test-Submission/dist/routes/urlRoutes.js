"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const urlController_1 = require("../controllers/urlController");
const router = (0, express_1.Router)();
router.post('/shorten', urlController_1.shortenUrl);
router.get('/statistics', urlController_1.getStatistics);
exports.default = router;
