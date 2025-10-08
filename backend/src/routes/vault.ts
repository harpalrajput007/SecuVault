import { Router } from 'express';
import {
  createVaultItem,
  getVaultItems,
  getVaultItem,
  updateVaultItem,
  deleteVaultItem,
  vaultValidation
} from '../controllers/vaultController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.post('/', vaultValidation, createVaultItem);
router.get('/', getVaultItems);
router.get('/:id', getVaultItem);
router.put('/:id', vaultValidation, updateVaultItem);
router.delete('/:id', deleteVaultItem);

export default router;