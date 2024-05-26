import { Router } from "express";
import waitlistController from "../controllers/waitlist-controller";
import userController from "../controllers/user-controller";
import { body } from "express-validator";
import authMiddleware from "../middlewares/auth-middleware";
import roleMiddleware from "../middlewares/role-middleware";

const router = Router();

/**
 * @swagger
 * /:
 *   post:
 *     description: Add a new wait item
 *     summary: Add a new wait item
 *     tags: [Waitlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "kozachkov@example.com"
 *               name:
 *                 type: string
 *                 example: "Rostyslav Kozachkov"
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WaitListItem'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email already exists"
 */
router.post("/", waitlistController.addWaitItem);

/**
 * @swagger
 * /waitlist:
 *   get:
 *     summary: Retrieve the waitlist
 *     tags: [Waitlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of waitlist items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WaitListItem'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 */
router.get("/waitlist", authMiddleware, waitlistController.fetchWaitList);

/**
 * @swagger
 * /waitlist/{searchTerm}:
 *   get:
 *     summary: Search for waitlist items by search term
 *     description: Retrieve waitlist items that match the search term in email, name, or queue.
 *     tags: [Waitlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: searchTerm
 *         required: true
 *         schema:
 *           type: string
 *         description: Term to search for in email, name, or queue.
 *       - in: query
 *         name: column
 *         required: false
 *         schema:
 *           type: string
 *           enum: [queue, name, email]
 *           default: queue
 *         description: Column to sort by.
 *       - in: query
 *         name: orderBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order.
 *     responses:
 *       200:
 *         description: A list of searched waitlist items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WaitListItem'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       400:
 *         description: Items Not Found or Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Items Not Found"
 */
router.get(
  "/waitlist/:searchTerm",
  authMiddleware,
  waitlistController.searchWaitItem
);

/**
 * @swagger
 * /waitlist:
 *   delete:
 *     summary: Delete a waitlist item (only ADMIN)
 *     description: Delete a waitlist item (only accessible for ADMIN users)
 *     tags: [Waitlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Delete wait item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: Wait item with email - "kozachkov@example.com" and name - "Rostyslav Kozachkov" was successfully deleted
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You don't have access"
 */
router.delete(
  "/waitlist",
  roleMiddleware(["ADMIN"]),
  waitlistController.deleteWaitItem
);

/**
 * @swagger
 * /waitlist:
 *   put:
 *     summary: Update a waitlist item
 *     description: Updates an existing waitlist item. Only accessible by users with ADMIN role.
 *     tags: [Waitlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               email:
 *                 type: string
 *                 example: "kozachkov@example.com"
 *               name:
 *                 type: string
 *                 example: "Rostyslav Kozachkov"
 *               queue:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Waitlist item successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wait item with email - "example@example.com" and name - "John Doe" was successfully updated
 *       400:
 *         description: Validation error or Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation error
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         example: "invalid value"
 *                       msg:
 *                         type: string
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         example: "email"
 *                       location:
 *                         type: string
 *                         example: "body"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */
router.put(
  "/waitlist",
  roleMiddleware(["ADMIN"]),
  body("email").isEmail(),
  body("name").isLength({ min: 6, max: 20 }),
  body("queue").isInt({ gt: 0 }),
  waitlistController.editWaitItem
);

/**
 * @swagger
 * /registration:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with email and password. This route will validate the input and create a new user if the input is valid.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "kozachkov@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Validation error or Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         example: "invalid value"
 *                       msg:
 *                         type: string
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         example: "email"
 *                       location:
 *                         type: string
 *                         example: "body"
 */
router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 6, max: 32 }),
  userController.registration
);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     description: Login a user with email and password. This route will validate the input and return user data if the input is valid.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "kozachkov@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Validation error or Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         example: "invalid value"
 *                       msg:
 *                         type: string
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         example: "email"
 *                       location:
 *                         type: string
 *                         example: "body"
 */
router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 6, max: 32 }),
  userController.login
);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout a user
 *     description: Logout a user by clearing the refresh token cookie.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully logged out"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bad Request"
 */
router.post("/logout", userController.logout);

/**
 * @swagger
 * /activate/{link}:
 *   get:
 *     summary: Activate a user's email
 *     description: Activates a user's account using the activation link provided in the email.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: link
 *         required: true
 *         schema:
 *           type: string
 *         description: Activation link
 *     responses:
 *       302:
 *         description: Redirect to the client URL after successful activation
 *         headers:
 *           Location:
 *             description: URL to redirect to after successful activation
 *             schema:
 *               type: string
 *               example: http://localhost:5173/
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid activation link"
 */
router.get("/activate/:link", userController.activateEmail);

/**
 * @swagger
 * /refresh:
 *   get:
 *     summary: Refresh user authentication token
 *     description: Refreshes the user's authentication token using the refresh token stored in cookies.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successful token refresh
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "newAccessToken"
 *                 refreshToken:
 *                   type: string
 *                   example: "newRefreshToken"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid refresh token"
 */
router.get("/refresh", userController.refresh);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Check if user is logged in
 *     description: Verifies if the user is logged for getting fresh user data by their cookie token.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User is logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 isActivated:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid refresh token"
 */
router.get("/user", userController.isLoginedUser);

export default router;
