import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import VaultItem from '../models/VaultItem';
import { AuthRequest } from '../types';

export const vaultValidation = [
  body('title').trim().isLength({ min: 1 }),
  body('username').trim().isLength({ min: 1 }),
  body('password').isLength({ min: 1 })
];

export const createVaultItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { title, username, password, url, notes, category, isFavorite } = req.body;
    
    const vaultItem = new VaultItem({
      title,
      username,
      password,
      url,
      notes,
      category: category || 'General',
      isFavorite: isFavorite || false,
      userId: req.userId
    });

    await vaultItem.save();
    res.status(201).json(vaultItem);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getVaultItems = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    let query: any = { userId: req.userId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await VaultItem.find(query).sort({ updatedAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getVaultItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await VaultItem.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateVaultItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { title, username, password, url, notes, category, isFavorite } = req.body;
    const updateData: any = { title, username, password, url, notes, category, isFavorite };

    const item = await VaultItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updateData,
      { new: true }
    );

    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteVaultItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await VaultItem.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};