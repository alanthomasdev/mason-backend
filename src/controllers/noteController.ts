import { RequestHandler, Request } from "express";
import Note from "../models/Note";

export const createNote: RequestHandler = async (req, res) => {
  const { title, content, summary, tags } = req.body;
  const userId = req.userId;

  try {
    // Placeholder for summary (later replaced with AI)
    // const summary = content.substring(0, 100) + "...";

    const note = await Note.create({
      title,
      content,
      summary,
      tags,
      userId,
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to create note", error: err });
  }
};





export const getNotes: RequestHandler = async (req, res) => {
  const userId = req.userId;
  const { page = 1, limit = 10 } = req.query;

  try {
    const notes = await Note.find({ userId })
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notes", error: err });
  }
};

export const getNoteById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      res.status(404).json({ message: "Note not found" });
      return;
    }
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch note", error: err });
  }
};

import User from "../models/User"; // Make sure this import exists

export const searchNotes: RequestHandler = async (req, res) => {
  const userId = req.userId;
  const { q = "", page = 1, limit = 10 } = req.query;

  try {
    const keyword = new RegExp(q.toString(), "i");
    const skip = (Number(page) - 1) * Number(limit);

    const searchQuery = {
      userId,
      $or: [
        { title: keyword },
        { content: keyword },
        { tags: keyword },
      ],
    };

    // 🟡 1. If user still has firstLogin = true, update it to false
    await User.updateOne({ _id: userId, firstLogin: true }, { $set: { firstLogin: false } });

    const [notes, total] = await Promise.all([
      Note.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Note.countDocuments(searchQuery),
    ]);

    res.status(200).json({
      notes,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: "Search failed", error: err });
  }
};




export const updateNote: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { title, content, tags } = req.body;
  const userId = req.userId;

  try {
    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      {
        title,
        content,
        tags,
        summary: content.substring(0, 100) + "...", // Update summary
      },
      { new: true }
    );

    if (!note) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to update note", error: err });
  }
};

export const deleteNote: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const note = await Note.findOneAndDelete({ _id: id, userId });
    if (!note) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete note", error: err });
  }
};
