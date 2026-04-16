import { myDataSource } from "../config/db.js";

const announcementRepo = myDataSource.getRepository("Announcement");

export const createAnnouncement = async (req, res) => {
  try {
    const { title, status, content, by, date, category, audience } = req.body;

    const newAnnouncement = announcementRepo.create({
      title,
      status: status || "Published",
      content,
      by: by || "Admin",
      date,
      category,
      audience
    });

    await announcementRepo.save(newAnnouncement);

    return res.status(200).json({ code: 200, message: "Announcement created successfully", data: newAnnouncement });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 500, message: "Internal server error" });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await announcementRepo.find({ where: { isDeleted: false }, order: { id: "DESC" } });
    return res.status(200).json({ code: 200, data: announcements });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 500, message: "Internal server error" });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const announcement = await announcementRepo.findOne({ where: { id: parseInt(id) } });

    if (!announcement) {
      return res.status(404).json({ code: 404, message: "Announcement not found" });
    }

    if (updateData.title) announcement.title = updateData.title;
    if (updateData.status) announcement.status = updateData.status;
    if (updateData.content) announcement.content = updateData.content;
    if (updateData.category) announcement.category = updateData.category;
    if (updateData.audience) announcement.audience = updateData.audience;

    await announcementRepo.save(announcement);

    return res.status(200).json({ code: 200, message: "Announcement updated successfully", data: announcement });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 500, message: "Internal server error" });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    
    const announcement = await announcementRepo.findOne({ where: { id: parseInt(id) } });

    if (!announcement) {
      return res.status(404).json({ code: 404, message: "Announcement not found" });
    }

    announcement.isDeleted = true;
    await announcementRepo.save(announcement);

    return res.status(200).json({ code: 200, message: "Announcement deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 500, message: "Internal server error" });
  }
};
