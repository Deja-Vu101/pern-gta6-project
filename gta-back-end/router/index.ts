import { Router } from "express";
import waitlistController from "../controllers/waitlist-controller";
import userController from "../controllers/user-controller";
import { body } from "express-validator";
import authMiddleware from "../middlewares/auth-middleware";
import roleMiddleware from "../middlewares/role-middleware";

const router = Router();

router.post("/", waitlistController.addWaitItem);
router.get("/waitlist", authMiddleware, waitlistController.fetchWaitList);
router.get(
  "/waitlist/:searchTerm",
  authMiddleware,
  waitlistController.searchWaitItem
);
router.delete(
  "/waitlist",
  roleMiddleware(["ADMIN"]),
  waitlistController.deleteWaitItem
);
router.put(
  "/waitlist",
  roleMiddleware(["ADMIN"]),
  body("email").isEmail(),
  body("name").isLength({ min: 6, max: 20 }),
  body("queue").isInt({ gt: 0 }),
  waitlistController.editWaitItem
);

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
router.get("/refresh", userController.refresh);
router.get("/user", userController.isLoginedUser)

export default router;