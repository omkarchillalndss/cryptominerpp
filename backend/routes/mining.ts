import { Router } from 'express';
import { start, upgrade, stop, claim } from '../controllers/mining';
const r = Router();
r.post('/start', start);
r.put('/upgrade', upgrade);
r.post('/stop', stop);
r.post('/claim', claim);
export default r;
