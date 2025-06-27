import { RequestHandler, Router } from 'express';
import { shortenUrl, getStatistics } from '../controllers/urlController';

const router = Router();

router.post('/shorten', shortenUrl as RequestHandler);
router.get('/statistics', getStatistics as RequestHandler);

export default router; 