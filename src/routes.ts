import { Router, Request, Response } from "express";

import { AuthenticateUserController } from "./controllers/AuthenticateUserController";

const router = Router();

const authenticateUserController = new AuthenticateUserController();

router.get('/instagram/signin', authenticateUserController.signin);

router.get('/instagram/callback', authenticateUserController.callback);

router.get('/instagram/user', authenticateUserController.getUserInfo);

export { router };