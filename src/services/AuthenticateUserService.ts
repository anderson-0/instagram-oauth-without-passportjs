import axios from 'axios';
import prismaClient from '../prisma';
import { sign } from 'jsonwebtoken';
import qs from 'querystring';
import FormData from 'form-data';


interface IShortLivedAccessTokenResponse {
  access_token: string;
  user_id: string
}

interface ILongLivedAccessTokenResponse {
  access_token: string;
}

interface IMeResponse {
  id: string;
  name: string;
}

class AuthenticateUserService {
  async getAccessToken(code: string) {
    // Get short-lived access token
    const url = `${process.env.INSTAGRAM_ACCESS_TOKEN_URL}?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${process.env.INSTAGRAM_CALLBACK_URL}&client_secret=${process.env.INSTAGRAM_APP_SECRET}&code=${code}&grant_type=authorization_code`;

    const formData = new FormData();
    formData.append('client_id', process.env.INSTAGRAM_APP_ID);
    formData.append('client_secret', process.env.INSTAGRAM_APP_SECRET);
    formData.append('code', code);
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', process.env.INSTAGRAM_CALLBACK_URL);

    // First we need to obtain a short-lived token
    const {data: { access_token: shortLivedAccessToken, user_id }} = await axios.post<IShortLivedAccessTokenResponse>(process.env.INSTAGRAM_ACCESS_TOKEN_URL, formData, {
      headers: formData.getHeaders()
    });

    // After we exchange it for a long-lived token
    const { data: { access_token: longLivedAccessToken } } = await axios.get<ILongLivedAccessTokenResponse>(process.env.INSTAGRAM_ACCESS_TOKEN_LONG_URL,{
      params: {
        grant_type: 'ig_exchange_token',
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        access_token: shortLivedAccessToken
      }
    });
        
    let user = await prismaClient.user.findFirst({
      where: {
        id: user_id
      }
    });

    if (!user) {
      
      // Saves access_token in the database
      user = await prismaClient.user.create({
        data: {
          id: user_id as string,
          access_token: longLivedAccessToken as string
        }
      })
    }

    // Generates JWT Token passing user info as payload
    const token = sign(
      {
        user: {
          user_id
        },
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: process.env.JWT_EXPIRATION
      }
    )

    // Returning both JWT Token as the user data containing the access_token
    // In Production, the access_token should be stored in a secure way
    return {
      token,
      user
    };
  }

  async getUserInfo(id: string) {
    let user = await prismaClient.user.findFirst({
      where: {
        id
      }
    });

    if (!user) {
      throw new Error("Invalid User ID");
    }
    return user;
  }
}

export { AuthenticateUserService }