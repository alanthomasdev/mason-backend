import express from 'express';
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  searchNotes
} from '../controllers/noteController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticate);

router.post('/', createNote);
router.get('/', getNotes);
router.get("/search", searchNotes);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
