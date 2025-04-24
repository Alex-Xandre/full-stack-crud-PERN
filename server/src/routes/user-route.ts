import express from 'express';
import * as userController from '../controllers/user-controller';
import multer from 'multer';
import protect from '../middlewares/auth-protect';

const router = express.Router();
const upload = multer();

router.post('/', upload.single('photo'), protect, userController.createUser);
router.get('/', protect, userController.getUsers);
router.put('/:id', protect, upload.single('photo'), userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/login', userController.loginUser);
export default router;
