import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("")
  const [kids, setKids] = useState(null)
  const [hasBackyard, setHasBackyard] = useState(null)
  const [otherPets, setOtherPets] = useState([])
  const [petExperience, setPetExperience] = useState(null)
  // const [latitude, setLatitude] = useState()
  // const [longitude, setLongitude] = useState()
  const [location, setLocation] = useState({latitude: null, longitude: null});
  const [radius, setRadius] = useState(.1)
  const [errors, setErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState({})
  const { closeModal } = useModal();

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Client-side validation
  useEffect(() => {
    const newErrors = {};

    if (email && !validateEmail(email)) newErrors.email = "Please provide a valid email address";
    if (password && confirmPassword && password !== confirmPassword) newErrors.confirmPassword = "Passwords must match";
    if (password && password.length < 6) newErrors.password = "Password must be at least 6 characters long";
    if (kids === null) newErrors.kids = "Please answer question."
    if (hasBackyard.length === 0) newErrors.hasBackyard = "Please answer question."
    if (petExperience === null) newErrors.petExperience = "Please answer question"


    setValidationErrors(newErrors);
  }, [email, password, confirmPassword, kids, hasBackyard]);


  useEffect(() => {
    if (!navigator.geolocation) {
      setErrors({location: "Geolocation is not supported by your browser"})
      return
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({latitude: position.coords.latitude, longitude: position.coords.longitude})
    }, (error) => setErrors({location: error.message}))
  }, [])




  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        firstName,
        lastName,
        username,
        email,
        password,
        avatar,
        kids,
        hasBackyard,
        otherPets,
        petExperience,
        latitude: location.latitude,
        longitude: location.longitude,
        radius
      })
    );

    // if (serverResponse) {
    //   setErrors(serverResponse);
    // } else {
    //   closeModal();
    // }

    if (serverResponse) {
      // Handle nested errors object
      if (serverResponse.errors) setErrors(serverResponse.errors);
      // Handle flat error object
      else if (typeof serverResponse === 'object') setErrors(serverResponse);
      // Handle string error
      else setErrors({ general: serverResponse });
    } else {
      closeModal();
      navigate("/");
    }
  };

  const handleOtherPetsChange = (e) => {
    const {val, checked} = e.target
    setOtherPets((prev) => {
      checked ? [...prev, val] : prev.filter((pet) => pet !== val)
    })
  }

  return (
    <div className="signup-modal">
      <div className="signup-header">
        <h1>Sign Up</h1>
      </div>

      <form className="signup-form" onSubmit={handleSubmit}>
        {errors.general && (
          <div className="error-banner">
            {errors.general}
          </div>
        )}

        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className={errors.username ? 'error' : ''}
            required
          />
          {errors.username && <p className="signup-error-message">{errors.username}</p>}
        </label>

        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
          />
        </label>

        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
          />
        </label>

        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={errors.email ? 'error' : ''}
            required
          />
          {errors.email && <p className="signup-error-message">{errors.email}</p>}
          {validationErrors.email && <p className="signup-error-message">{validationErrors.email}</p>}
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          {errors.password && <p className="signup-error-message">{errors.password}</p>}
          {validationErrors.password && <p className="signup-error-message">{validationErrors.password}</p>}
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          {errors.confirmPassword && <p className="signup-error-message">{errors.confirmPassword}</p>}
          {validationErrors.confirmPassword && (
            <p className="signup-error-message">{validationErrors.confirmPassword}</p>
          )}
        </label>

        <label>Do you have kids?</label>
        <div>
          <label>
            <input
              type="radio"
              name='kids'
              value='true'
              checked={kids === true}
              onChange={() => setKids(true)}
              required
            /> Yes
          </label>

          <label>
            <input
              type="radio"
              name='kids'
              value='false'
              checked={kids === false}
              onChange={() => setKids(false)}
              required
            /> No
          </label>
            {errors.kids && <p className="signup-error-message">{errors.kids}</p>}
            {validationErrors.kids && <p className="signup-error-message">{validationErrors.kids}</p>}

        </div>

        <label>Do you have a backyard?</label>
        <div>
          <label>
            <input
              type="radio"
              name='hasBackyard'
              value='true'
              checked={hasBackyard === true}
              onChange={() => setHasBackyard(true)}
              required
            /> Yes
          </label>

          <label>
            <input
              type="radio"
              name='hasBackyard'
              value='false'
              checked={hasBackyard === false}
              onChange={() => setHasBackyard(false)}
              required
            /> Yes
          </label>
            {errors.hasBackyard && <p className="signup-error-message">{errors.hasBackyard}</p>}
            {validationErrors.hasBackyard && <p className="signup-error-message">{validationErrors.hasBackyard}</p>}
        </div>

        <label>Do you have any other pets?</label>
          <div>
            <input
              type="checkbox"
              id='none'
              value='None'
              checked={otherPets.includes("None")}
              onChange={handleOtherPetsChange}
              required
            />
            <label htmlFor='none'>None</label>

            <input
              type="checkbox"
              id='dogs'
              value='Dogs'
              checked={otherPets.includes("Dogs")}
              onChange={handleOtherPetsChange}
              required
            />
            <label htmlFor='dogs'>Dogs Only</label>

            <input
              type="checkbox"
              id='cats'
              value='Cats'
              checked={otherPets.includes("Cats")}
              onChange={handleOtherPetsChange}
              required
            />
            <label htmlFor='cats'>Cats Only</label>

            <input
              type="checkbox"
              id='both'
              value='Both'
              checked={otherPets.includes("Both")}
              onChange={handleOtherPetsChange}
              required
            />
            <label htmlFor='both'>Both</label>

            <input
              type="checkbox"
              id='other'
              value='Other'
              checked={otherPets.includes("Other")}
              onChange={handleOtherPetsChange}
              required
            />
            <label htmlFor='other'>Other Only</label>
          </div>

            {errors.otherPets && <p className="signup-error-message">{errors.otherPets}</p>}
            {validationErrors.otherPets && <p className="signup-error-message">{validationErrors.otherPets}</p>}

                  <label>Do you have a backyard?</label>
        <div>
          <label>
            <input
              type="radio"
              name='hasBackyard'
              value='true'
              checked={hasBackyard === true}
              onChange={() => setHasBackyard(true)}
              required
            /> Yes
          </label>

          <label>
            <input
              type="radio"
              name='hasBackyard'
              value='false'
              checked={hasBackyard === false}
              onChange={() => setHasBackyard(false)}
              required
            /> Yes
          </label>
            {errors.hasBackyard && <p className="signup-error-message">{errors.hasBackyard}</p>}
            {validationErrors.hasBackyard && <p className="signup-error-message">{validationErrors.hasBackyard}</p>}
        </div>

        <label>What's your pet experience?</label>
        <div>
          <label>
            <input
              type="radio"
              name='petExperience'
              value='firstTime'
              checked={petExperience === "firstTime"}
              onChange={(e) => setPetExperience(e.target.value)}
              required
            /> First Time
          </label>

          <label>
            <input
              type="radio"
              name='petExperience'
              value='previous'
              checked={petExperience === "previous"}
              onChange={(e) => setPetExperience(e.target.value)}
              required
            /> Previous
          </label>

          <label>
            <input
              type="radio"
              name='petExperience'
              value='current'
              checked={petExperience === "current"}
              onChange={(e) => setPetExperience(e.target.value)}
              required
            /> <Current></Current>
          </label>
            {errors.petExperience && <p className="signup-error-message">{errors.petExperience}</p>}
            {validationErrors.petExperience && <p className="signup-error-message">{validationErrors.petExperience}</p>}
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
