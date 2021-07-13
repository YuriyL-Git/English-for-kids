import React, { ReactElement, useState } from 'react';
import './_login-form.scss';
import { useHistory } from 'react-router-dom';
import loginUser from '../../services/auth/login-user';
import { useAppDispatch } from '../../hooks/hooks';
import { loginAdmin } from '../../features/server-slice';

const WRONG_LOGIN_DATA_MSG =
  'Incorrect login or password!User: Admin, Password: Admin';

const LoginForm = (): ReactElement => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [wrongLoginMessage, setWrongLoginMessage] = useState('');

  const submitLogin = () => {
    loginUser(username, password).then(res => {
      if (!res) setWrongLoginMessage(WRONG_LOGIN_DATA_MSG);
      if (res) {
        setWrongLoginMessage('');
        dispatch(loginAdmin());
        history.push('/');
      }
    });
  };

  return (
    <div className="login-form">
      <div className="login-form__title">Login</div>
      <input
        type="text"
        className="login-form__input"
        placeholder="login"
        onChange={event => setUsername(event.target.value)}
      />
      <input
        type="password"
        className="login-form__input"
        placeholder="password"
        onChange={event => setPassword(event.target.value)}
      />
      <div className="login-form__wrong-login-msg">{wrongLoginMessage}</div>
      <div className="login-form__btn-wrapper">
        <button className="login-form__btn" type="button" onClick={submitLogin}>
          Login
        </button>
        <button
          className="login-form__btn btn-red"
          type="button"
          onClick={() => {
            history.goBack();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
