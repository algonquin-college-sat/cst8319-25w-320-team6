const express = require("express");
const eventController = require("../controllers/eventController");
const authController = require("../controllers/authController");
const router = express.Router();

router.get("/readEvent", eventController.getAllEvents);
router.post(
  "/addEvent",
  authController.restrict("Administrator"),
  eventController.addEvent,
);
router.patch(
  "/updateEvent/:id",
  authController.restrict("Administrator"),
  eventController.updateEvent,
);
router.delete(
  "/deleteEvent/:id",
  authController.restrict("Administrator"),
  eventController.deleteEvent,
);
router.get("/getEventById/:id", eventController.getEventById);
router.post(
  "/upload",
  eventController.upload.single("file"),
  eventController.multerErrorHandling,
  eventController.handleFileUpload,
); //For upload images in form event
module.exports = router;
