import { Request, Response } from 'express';
import * as userService from '../services/user-service';

const createUser = async (req: Request, res: Response): Promise<void> => {
  const userData = req.body;
  const file = req.file;
  try {
    const newUser = await userService.createNewUser(userData, file as any);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating user' });
  }
};

const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userData = req.body;
    const file = req.file;
    const updatedUser = await userService.updateUserDetails(Number(id), userData, file as any);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating user' });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedUser = await userService.deleteUserById(Number(id));
    res.status(200).json(deletedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting user' });
  }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body; 

  try {
    const { user, token } = await userService.loginUser(username, password);
    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Eg" });
  }
};

export { createUser, getUsers, updateUser, deleteUser, loginUser };
