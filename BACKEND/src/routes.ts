import { Router } from 'express';
import multer from 'multer';
import { uploadConfig } from './lib/multer';
import { CreateUserController } from './controllers/CreateUserController';
import { AuthUserController } from './controllers/AuthUserController';
import { ListPetsController } from './controllers/ListPetsController';
import { CreatePetController } from './controllers/CreatePetController';
import { authMiddleware } from './middlewares/authMiddleware';
import { ProfileController } from './controllers/ProfileController';
import { GetPetDetailsController } from './controllers/GetPetDetailsController';
import { CreateSightingController } from './controllers/CreateSightingController';
import { MyPetsController } from './controllers/MyPetsController';
import { NotificationController } from './controllers/NotificationController';

const router = Router();
const upload = multer(uploadConfig);

const createUserController = new CreateUserController();
const authUserController = new AuthUserController();
const listPetsController = new ListPetsController(); 
const createPetController = new CreatePetController();
const profileController = new ProfileController();
const myPetsController = new MyPetsController();
const notificationController = new NotificationController();
const getPetDetails = new GetPetDetailsController();
const createSighting = new CreateSightingController();

router.get('/profile', authMiddleware, profileController.show);
router.put('/profile', authMiddleware, profileController.update);

router.post('/users', createUserController.handle);
router.post('/login', authUserController.handle);
router.get('/pets', listPetsController.handle); 
router.post(
    '/pets', 
    authMiddleware, 
    upload.array('images', 5), // Aceita até 5 arquivos no campo 'images'
    createPetController.handle
);

router.get('/pets/:id', getPetDetails.handle);
router.post('/pets/:id/sightings', authMiddleware, createSighting.handle);
router.get('/my-pets', authMiddleware, myPetsController.index);
router.patch('/pets/:id/resolve', authMiddleware, myPetsController.resolve);
router.get('/notifications', authMiddleware, notificationController.index);
router.patch('/notifications/:id/read', authMiddleware, notificationController.markAsRead);

export { router };