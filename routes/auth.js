const authRouter = require('express').Router();
const User = require('../models/user');
const { calculateToken } = require('../helpers/users');

authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;
  User.findByEmail(email).then((user) => {
    if (!user) res.status(401).send('Invalid credentials');
    else {
      User.verifyPassword(password, user.hashedPassword).then(
        (passwordIsCorrect) => {
          if (passwordIsCorrect) {
            const token = calculateToken(email);
            User.update(user.id, token);
            res.cookie('user_token', token);
            res.send('Authentication ok');
          } else res.status(401).send('Invalid credentials');
        }
      );
    }
  });
});

module.exports = authRouter;
