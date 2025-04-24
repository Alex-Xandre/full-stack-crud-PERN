import { uploadImage } from './s3-services';
import { createUser, getUsers, updateUser, deleteUser, getUserForLogin } from '../model/user-model';
import bcrypt from 'bcrypt';
import { generateToken } from '../middlewares/jwt-functions';

const createNewUser = async (userData: any, file: Express.Multer.File) => {
  if (file) {
    const s3Response = await uploadImage(file.buffer, file.originalname, file.mimetype);
    userData.photoUrl = s3Response.Location;
  }
  return createUser(userData, userData.photoUrl);
};

const getAllUsers = async () => {
  return getUsers();
};

const updateUserDetails = async (id: number, userData: any, file: Express.Multer.File) => {
  let photoUrl = null;
  if (file) {
    const s3Response = await uploadImage(file.buffer, file.originalname, file.mimetype);
    photoUrl = s3Response.Location;
  }
  return updateUser(id, userData, photoUrl as string);
};

const deleteUserById = async (id: number) => {
  return deleteUser(id);
};

const loginUser = async (username: string, password: string) => {
  const user = await getUserForLogin(username);

  console.log(user)
  if (!user) {
    throw new Error('User not founds');
  }

  const isPasswordValid = await bcrypt.compare(password, (user as any).password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const token = generateToken((user as any).id);

  return { user, token };
};
export { createNewUser, getAllUsers, loginUser, updateUserDetails, deleteUserById };
