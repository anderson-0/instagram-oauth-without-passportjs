import { Request, Response } from 'express';
import { AuthenticateUserService } from '../services/AuthenticateUserService';


class AuthenticateUserController {
  async signin(req: Request, res: Response) {
    const url = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${encodeURI(process.env.INSTAGRAM_CALLBACK_URL)}&scope=user_media,user_profile&response_type=code`;
    res.redirect(url);
  }

  async callback(req: Request, res: Response) {
    const code = req.query.code as string;
    const authenticateUser = new AuthenticateUserService();

    try {
      const response = await authenticateUser.getAccessToken(code);

      // Here instead should redirect the user to some protected page because the user is authenticated now
      return res.json(response);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }    
  }

  async getUserInfo(req: Request, res: Response) {
    const id = req.query.id as string;
    const authenticateUser = new AuthenticateUserService();
    try {
      const response = await authenticateUser.getUserInfo(id);
      return res.json(response);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }
}

export { AuthenticateUserController }