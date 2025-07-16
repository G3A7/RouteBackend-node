import Note from "../model/note.model.js";
export const createNote = async (req, res) => {
  try {
    const { user } = req;
    //  برضو للتاكيد وهو اصلا مستحيل يجي هنا وهو مش user 😱
    if (!user) {
      res.status(404).json({ message: "Not Found" });
    }

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "All fields Required" });
    }

    const newNot = new Note({ ...req.body, userId: user._id });
    await newNot.save();

    res.status(201).json({ message: "Note Created" });
  } catch (error) {
    console.log("error in createNote", error);
    res.status(500).json({ message: error });
  }
};

// update Patch
export const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { user } = req;
    const { id } = req.params;
    //  برضو للتاكيد وهو اصلا مستحيل يجي هنا وهو مش user 😱
    if (!user) {
      return res.status(404).json({ message: "Not Found" });
    }

    const myNote = await Note.findById(id);
    if (!myNote) {
      return res.status(404).json({ message: "not found Note" });
    }

    if (myNote?.userId.toString() !== user?._id.toString()) {
      return res.status(401).json({ message: "Not Owner" });
    }

    if (!(title == undefined)) {
      if (title.length == 0) {
        return res.status(400).json({ message: "title must be 1 or more" });
      }
    }
    if (!(content == undefined)) {
      if (content.length == 0) {
        return res.status(400).json({ message: "content must be 1 or more" });
      }
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    if (!updatedNote) {
      return res.status(400).json({ message: "Failed to update note" });
    }

    res
      .status(200)
      .json({ status: "success", updatedNote, messgae: "updated" });
  } catch (error) {
    console.log("error in updateNote", error);
    res.status(500).json({ message: error });
  }
};

// update Put
export const updateNotePut = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "All fields Required" });
    }
    //  برضو للتاكيد وهو اصلا مستحيل يجي هنا وهو مش user 😱
    if (!user) {
      return res.status(404).json({ message: "Not Found" });
    }

    const myNote = await Note.findById(id);
    if (!myNote) {
      return res.status(404).json({ message: "not found Note" });
    }

    if (myNote?.userId.toString() !== user?._id.toString()) {
      return res.status(401).json({ message: "Not Owner" });
    }

    const updatedNote = await Note.findOneAndReplace(
      { _id: id },
      { ...req.body, userId: user._id },
      { new: true }
    );
    if (!updatedNote) {
      return res.status(400).json({ message: "Failed to update note" });
    }

    res
      .status(200)
      .json({ status: "success", updatedNote, messgae: "updated" });
  } catch (error) {
    console.log("error in updateNotePut", error);
    res.status(500).json({ message: error });
  }
};

export const updateAllNoteTitle = async (req, res) => {
  try {
    const { title } = req.body;
    const { user } = req;
    if (!title) {
      return res.status(400).json({ message: "Title Required" });
    }
    const allMyNote = await Note.find({ userId: user._id });
    if (allMyNote.length == 0) {
      return res.status(404).json({ message: "no Note Found" });
    }
    const updated = await Note.updateMany(
      {
        userId: user._id,
      },
      {
        title,
      }
    );
    if (updated.modifiedCount === 0) {
      return res.status(400).json({ message: "No notes were updated" });
    }
    res.status(200).json({ message: "All Notes Updated" });
  } catch (error) {
    console.log("error in updateNoteTitle", error);
    res.status(500).json({ message: error });
  }
};

export const deleteSingleNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const MyNote = await Note.findById(id);
    if (!MyNote) {
      return res.status(404).json({ message: "Not Found Not" });
    }
    if (MyNote.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "انت هتستعبطني انا يالا " });
    }
    const deletedNote = await Note.findByIdAndDelete(id, {
      new: true,
    });
    if (!deletedNote) {
      return res.status(400).json({ message: "Faild" });
    }
    res.status(200).json({ message: "deleted", MyNote });
  } catch (error) {
    console.log("error in Delete", error);
    res.status(500).json({ message: error });
  }
};

export const getNotes = async (req, res) => {
  try {
    const { user } = req;
    // console.log(req.query);
    let { page, limit } = req.query;
    page = +page || 1;
    limit = +limit || 2;
    const skip = (page - 1) * limit;

    const myNotes = await Note.find({ userId: user._id })
      .limit(limit)
      .skip(skip)
      .sort("-createdAt");
    if (!myNotes || myNotes.length == 0) {
      return res.status(404).json({ message: "not found" });
    }
    res.status(200).json({ myNotes });
  } catch (error) {
    console.log("error in getNotes", error);
    res.status(500).json({ message: error });
  }
};
export const getSingleNote = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const myNote = await Note.findById(id);
    if (!myNote) {
      return res.status(404).json({ message: "Not found" });
    }
    if (user._id.toString() !== myNote.userId.toString()) {
      return res.status(401).json({ message: "Not Owner" });
    }

    res.status(200).json({ myNote });
  } catch (error) {
    console.log("error in getSingleNotes", error);
    res.status(500).json({ message: error });
  }
};

export const getNoteContent = async (req, res) => {
  try {
    const { user } = req;
    const { content } = req.query;

    if (!content) {
      return res.status(400).json({ message: "content is Required" });
    }

    const note = await Note.findOne({ content });
    if (!note) {
      return res.status(404).json({ message: "Not Found Message" });
    }
    // ممكن اه اعملها في
    if (note.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Not Owner" });
    }
    res.status(200).json({ note });
  } catch (error) {
    console.log("error in getSingleNotesContent", error);
    res.status(500).json({ message: error });
  }
};

export const getNotesSpecificFileds = async (req, res) => {
  try {
    const { user } = req;

    const myNotes = await Note.find({ userId: user._id })
      .select("title createdAt  userId _id")
      .populate("userId", "email");

    res.status(200).json({ myNotes });
  } catch (error) {
    console.log("error in getNotesSpecificFileds", error);
    res.status(500).json({ message: error });
  }
};

export const getNoteAggregate = async (req, res) => {
  try {
    const { user } = req;
    const { title } = req.query;

    const matchStage = {
      userId: user._id,
    };

    if (title) {
      matchStage.title = title;
    }

    const notes = await Note.aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "users", // اسم الكولكشن الخاص بالمستخدمين
          localField: "userId", // في Note
          foreignField: "_id", // في User
          as: "user",
        },
      },
      {
        $unwind: "$user", // لأن نتيجة $lookup بترجع Array
      },
      {
        $project: {
          title: 1,
          userId: 1,
          createdAt: 1,
          user: {
            name: "$user.name",
            email: "$user.email",
          },
        },
      },
    ]);

    res.status(200).json(notes);
  } catch (error) {
    console.log("error in getNoteAggregate", error);
    res.status(500).json({ message: error });
  }
};

export const deleteAllNotes = async (req, res) => {
  try {
    const { user } = req;
    await Note.deleteMany({ userId: user._id });
    res.status(200).json({ message: "deleted" });
  } catch (error) {
    console.log("error in deleteAllNotes", error);
    res.status(500).json({ message: error });
  }
};
