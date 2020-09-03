import EmailController from './EmailController';
import User from '../models/user';
import Activation from '../models/activation';
import shortid from 'shortid';

export default class UserController {
  // Create and Save a new User
  public static async create(req, res) {
    try {
      const existingUser = await User.findOne({ email: req.body.email });

      if (existingUser) {
        res.statusMessage = 'Email already exist';
        return res.status(409).json({
          status: 'error',
          message: 'Email already exist',
        });
      }

      const user = await User.create({
        ...req.body,
        lastConnection: new Date(),
      });

      const activation = await Activation.create({
        userId: user._id,
        key: shortid()
          .replace(/[^A-Z\d]/gi, '')
          .slice(0, 3)
          .toLowerCase(),
      });

      EmailController.send(user.firstname, activation.key);
      console.log(user.firstname, activation.key, 'CODE VALIDATION ACCOUNT');
      const { password, blacklisted, grade, activation: activationStatus, ...rest } = user._doc;
      req.session.user = { ...rest };
      return res.json({ ...rest });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: "Une erreur s'est produite",
      });
    }
  }

  // Retrieve all User from the database.
  public static findAll(req, res) {
    User.find()
      .then((users) => {
        res.json({ users });
      })
      .catch((err) => res.send(err));
  }

  // Find a single User with an id
  public static findOne(req, res) {
    User.findById(req.params.id)
      .then((user) => res.json({ user }))
      .catch((err) => res.send(err));
  }

  // Update a User by the id in the request
  public static async updateOne(req, res) {
    try {
      const id = { _id: req.params.id };
      const response = await User.findOneAndUpdate(
        { _id: id },
        { $set: { ...req.body } },
        { new: true },
      );
      if (!response) {
        return Error('Error update your account');
      }
      req.session.user = response;
      res.json(req.session);
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: "Une erreur s'est produite",
      });
    }
  }

  // Delete a User with the specified id in the request
  public static async delete(req, res) {
    User.findByIdAndRemove(req.params.id)
      .exec()
      .then((user) => {
        if (!user) {
          return res.status(404).end();
        } else {
          res.status(204).end();
        }
      })
      .catch((err) => res.send(err));
  }

  public static async login(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email, password: req.body.password });
      if (!user) {
        res.statusMessage = "Ces identifiants n'existe pas";
        return res.status(400).json({
          status: 'error',
          message: "Ces identifiants n'existe pas",
        });
      }
      const { password, blacklisted, grade, ...rest } = user._doc;
      res.json({ ...rest });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: "Une erreur s'est produite",
      });
    }
  }
}
