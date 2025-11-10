import jwt from 'jsonwebtoken';

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.decode(token, { complete: false });
    return decoded;
  } catch (err) {
    return null;
  }
}
