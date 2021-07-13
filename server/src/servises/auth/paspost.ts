import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../../models/User';
import { DatabaseUserInterface } from '../../interfaces/user-interface';

const LocalStrategy = passportLocal.Strategy;

passport.use(
  new LocalStrategy((username: string, password: string, done) => {
    User.findOne({ username }, (err: Error, user: DatabaseUserInterface) => {
      if (err) throw err;
      if (!user) return done(null, false);
      bcrypt.compare(password, user.password, (error: Error, result: boolean) => {
        if (error) throw error;
        if (result) {
          return done(null, user);
        }
        return done(null, false);
      });
    });
  }),
);

passport.serializeUser((user: DatabaseUserInterface, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id: string, cb) => {
  User.findOne({ _id: id }, (err: Error, user: DatabaseUserInterface) => {
    const userInformation = {
      username: user?.username,
      isAdmin: user?.isAdmin,
      id: user?.id,
    };

    cb(err, userInformation);
  });
});

export default passport;
