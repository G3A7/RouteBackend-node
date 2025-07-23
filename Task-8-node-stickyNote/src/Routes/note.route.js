import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createNote,
  updateNote,
  updateNotePut,
  updateAllNoteTitle,
  deleteSingleNote,
  getNotes,
  getSingleNote,
  getNoteContent,
  getNotesSpecificFileds,
  deleteAllNotes,
  getNoteAggregate,
} from "../controllers/note.controller.js";

const router = express.Router();

router.get("/paginate-sort", authMiddleware, getNotes);
router.get("/note-with-user", authMiddleware, getNotesSpecificFileds);
router.get("/aggregate", authMiddleware, getNoteAggregate);
router.get("/note-by-content", authMiddleware, getNoteContent);
router.post("/", authMiddleware, createNote);
router.patch("/all", authMiddleware, updateAllNoteTitle);
router.delete("/", authMiddleware, deleteAllNotes);
router.get("/:id", authMiddleware, getSingleNote);
router.patch("/:id", authMiddleware, updateNote);
router.put("/:id", authMiddleware, updateNotePut);
router.delete("/:id", authMiddleware, deleteSingleNote);

export default router;
