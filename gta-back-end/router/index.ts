import { Router } from "express";
import waitlistController from "../controllers/waitlist-controller";
import userController from "../controllers/user-controller";
import { body } from "express-validator";

const router = Router();

router.post("/", waitlistController.addWaitItem);
router.get("/waitlist", waitlistController.fetchWaitList);
router.get("/waitlist/:searchTerm", waitlistController.searchWaitItem);

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 6, max: 32 }),
  userController.registration
);
router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 6, max: 32 }),
  userController.login
);
router.post("/logout", userController.logout);

router.get("/activate/:link", userController.activateEmail);

export default router;
