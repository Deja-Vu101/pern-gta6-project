import { Router } from "express";
import waitlistController from "../controllers/waitlist-controller";
import userController from "../controllers/user-controller";

const router = Router();

router.post("/", waitlistController.addWaitItem);
router.get("/waitlist", waitlistController.fetchWaitList);
router.get("/waitlist/:searchTerm", waitlistController.searchWaitItem);

router.post("/registration", userController.registration);
router.post("/login", userController.login);

router.get("/activate/:link", userController.activateEmail);

export default router;
