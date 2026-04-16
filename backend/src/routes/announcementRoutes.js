import express from 'express';
import { createAnnouncement, getAnnouncements, updateAnnouncement, deleteAnnouncement } from '../controller/announcementController.js';

const announcementRoute = express.Router();

announcementRoute.post("/createAnnouncement", createAnnouncement);
announcementRoute.get("/getAnnouncements", getAnnouncements);
announcementRoute.put("/:id", updateAnnouncement);
announcementRoute.delete("/:id", deleteAnnouncement);

export default announcementRoute;
