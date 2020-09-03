import express from 'express';
import UsersController from '../controllers/UserController';
import ActivationController from '../controllers/ActivationController';
import UserController from '../controllers/UserController';

const router = express.Router();

router.get('/getAll', UsersController.findAll);
router.get('/getOne/:id', UsersController.findOne);
router.post('/registration', UsersController.create);
router.put('/update/:id', UsersController.updateOne);
router.put('/activation/:id', ActivationController.validation);
router.post('/login', UserController.login);

export default router;
