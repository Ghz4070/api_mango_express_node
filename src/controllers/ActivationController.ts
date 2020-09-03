import Activation from '../models/activation';
import User from '../models/user';
import shortid from 'shortid';

class ActivationController {
  public static async validation(req, res) {
    try {
      const response = await Activation.findOneAndUpdate(
        { userId: req.params.id, key: req.body.code, status: false },
        { $set: { status: true } },
        { new: true },
      );

      const user = await User.findOneAndUpdate(
        { _id: req.params.id, activation: false },
        { $set: { activation: true } },
        { new: true },
      );

      console.log(response);
      if (!response || !user) {
        return res.status(500).json({
          status: 'error',
          message: 'Une erreur est survenue',
        });
      }
      res.status(204).end();
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: "Une erreur s'est produite",
      });
    }
  }
}

export default ActivationController;
