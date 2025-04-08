import { useState, useEffect } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { useNavigate } from "react-router-dom";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState({})
  const { closeModal } = useModal();
  const navigate = useNavigate()

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const newErrors = {};

    if (email && !validateEmail(email)) {
      newErrors.email = "Please provide a valid email address";
    }


    setValidationErrors(newErrors);
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({})

    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors)
    //   return
    // }

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      if (serverResponse.errors) setErrors(serverResponse.errors);
      else if (typeof serverResponse === 'object') {
        setErrors(serverResponse)
      } else {
        setErrors({ general: serverResponse})
      }
    } else {
      closeModal();
      navigate('/pets/swipe')
    }
  };

  const handleDemoLogin = async (e) => {
    e.preventDefault()
    const serverResponse = await dispatch(thunkLogin({
      email: 'alice@io.com',
      password: 'password'
    }))

    if (serverResponse) {
      setErrors(serverResponse)
    } else {
      closeModal()
      navigate('/pets/swipe')
    }
  }

  return (
    <div className='login-modal-container'>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className="login-form">
      {errors.general && (
          <div className="login-error-banner">
            {errors.general}
          </div>
        )}

        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email || validationErrors.email ? 'error' : ''}
            required
          />

          <p className="login-error-message">
            {errors.email || validationErrors.email || ''}
          </p>
        </label>

        {/* {errors.email && <p>{errors.email}</p>} */}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? 'error' : ''}
            required
          />

          <p className="login-error-message">
            {errors.password || ''}
          </p>

        </label>
        {/* {errors.password && <p>{errors.password}</p>} */}
        <button type="submit" className='login-button'>Log In</button>
        <button type="button" onClick={handleDemoLogin} className="demo-login">
          Demo User
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
