import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";
// import * as React from 'react'
import Slider from '@mui/material/Slider'
import { useNavigate } from "react-router-dom";

function SignupFormModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { closeModal } = useModal();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("")
  const [kids, setKids] = useState(null)
  const [hasBackyard, setHasBackyard] = useState(null)
  // const [otherPets, setOtherPets] = useState([])
  const [otherPets, setOtherPets] = useState(null)
  const [petExperience, setPetExperience] = useState(null)
  // const [latitude, setLatitude] = useState()
  // const [longitude, setLongitude] = useState()
  const [location, setLocation] = useState({latitude: null, longitude: null});
  const [radius, setRadius] = useState(5.0)
  const [errors, setErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState({})
  const [validationErrors2, setValidationErrors2] = useState({})
  const [showAdditionalModal1, setShowAdditionalModal1] = useState(false)
  const [showAdditionalModal2, setShowAdditionalModal2] = useState(false)
  const [houseTrained, setHouseTrained] = useState(null)
  const [specialNeeds, setSpecialNeeds] = useState(null)
  const [idealAge, setIdealAge] = useState(null)
  const [idealSex, setIdealSex] = useState(null)
  const [idealSize, setIdealSize] = useState(null)
  const [lifestyle, setLifestyle] = useState(null)

  const dogPreferences = {
    houseTrained,
    specialNeeds,
    idealAge,
    idealSex,
    idealSize,
    lifestyle,
  };

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Client-side validation
  useEffect(() => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required"
    if (!lastName.trim()) newErrors.lastName = "Last name is required"
    if (!username.trim()) newErrors.username = "Username is required"
    if (email && !validateEmail(email)) newErrors.email = "Please provide a valid email address";
    if (password && confirmPassword && password !== confirmPassword) newErrors.confirmPassword = "Passwords must match";
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm password"
    if (password && password.length < 6) newErrors.password = "Password must be at least 6 characters long";
    if (!avatar.trim()) newErrors.avatar = "Profile picture is required"



    setValidationErrors(newErrors);
  }, [avatar, password, confirmPassword, firstName, lastName, username, email]);

  useEffect(() => {
    const newErrors = {}

    if (kids === null) newErrors.kids = "Please answer question."
    if (hasBackyard === null) newErrors.hasBackyard = "Please answer question."
    if (otherPets === null) newErrors.otherPets = "Please answer question."
    if (petExperience === null) newErrors.petExperience = "Please answer question"

    setValidationErrors2(newErrors)
  }, [kids, hasBackyard, otherPets, petExperience])


  useEffect(() => {
    if (!navigator.geolocation) {
      setErrors((prev) => ({ ...prev, location: "Geolocation is not supported by your browser"}))
      return
    }

    navigator.geolocation.getCurrentPosition((position) => {
      if (!location.latitude || !location.longitude) setLocation({latitude: position.coords.latitude, longitude: position.coords.longitude})
    }, (error) => setErrors((prev) => ({ ...prev, location: error.message})))
  }, [location.latitude, location.longitude])




  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required"
    if (!lastName.trim()) newErrors.lastName = "Last name is required"
    if (!username.trim()) newErrors.username = "Username is required"
    if (!email.trim()) newErrors.email = "Email is required"
    if (!password) newErrors.password = "Password is required"
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters long";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords must match"

    if (Object.keys(newErrors).length > 0) {
      return setErrors((prev) => ({ ...prev, ...newErrors}))

    }

    setErrors({});
    setValidationErrors({});

    console.log({
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
      radius,
      // dogPreferences,  // <-- Debugging output
    });

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
        radius,
        dogPreferences
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
      setErrors({});
      setValidationErrors({});
      closeModal();
      navigate("/pets/swipe");
    }
  };

  // const handleOtherPetsChange = (e) => {
  //   const {value, checked} = e.target
  //   setOtherPets((prev) =>
  //     checked ? [...prev, value] : prev.filter((pet) => pet !== value)
  //   )
  // }
  console.log('look here for validation errors', validationErrors)

  return (
    <div className="signup-modal">

      <form className="signup-form" onSubmit={handleSubmit}>
        {!showAdditionalModal1 && (
          <>

            <div className="signup-header">
              <h1>Sign Up</h1>
            </div>
            {errors.general && (
              <div className="error-banner">
                {errors.general}
              </div>
            )}

            <div className="profile-container">
              <label className="profile-label">
                  Profile Picture
                  <input type="text" value={avatar} onChange={(e) => setAvatar(e.target.value)} />
              {validationErrors.avatar && <p className="login-error-message">{validationErrors.avatar}</p>}
              </label>

              {/* Show Image Preview */}
              {avatar && !errors.avatar && (
                <img src={avatar} alt="Avatar Preview" className="avatar-preview"/>
              )}
            </div>
              {errors.avatar && <p className="error-message">{errors.avatar}</p>}

            <div className="first-last-name-container">
              <label className="first-last-name-label">
                First Name
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />

                {errors.firstName && <p className="login-error-message">{errors.firstName}</p>}
              {validationErrors.firstName && <p className="login-error-message">{validationErrors.firstName}</p>}
              </label>

              <label className="first-last-name-label">
                Last Name
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />

                {errors.lastName && <p className="login-error-message">{errors.lastName}</p>}
              {validationErrors.lastName && <p className="login-error-message">{validationErrors.lastName}</p>}
              </label>
            </div>

            <label>
              Username
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={errors.username ? 'error' : ''}
                required
              />

              {errors.username && <p className="login-error-message">{errors.username}</p>}
              {validationErrors.username && <p className="login-error-message">{validationErrors.username}</p>}
            </label>


            <label>
              Email
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'error' : ''}
                required
              />
              {errors.email && <p className="login-error-message">{errors.email}</p>}
              {validationErrors.email && <p className="login-error-message">{validationErrors.email}</p>}
            </label>

            <div className='password-container'>
              <label className="password-label">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {errors.password && <p className="login-error-message">{errors.password}</p>}
                {validationErrors.password && <p className="login-error-message">{validationErrors.password}</p>}
              </label>

              <label className="password-label">
                Confirm Password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {errors.confirmPassword && <p className="login-error-message">{errors.confirmPassword}</p>}
                {validationErrors.confirmPassword && (
                  <p className="login-error-message">{validationErrors.confirmPassword}</p>
                )}
              </label>

            </div>
            <button
              type="button"
              onClick={() => setShowAdditionalModal1(true)}
              disabled={Object.keys(validationErrors).length > 0 || Object.keys(errors).length > 0}
              className={`next-button ${Object.keys(validationErrors).length > 0 || Object.keys(errors).length > 0 ? 'disabled' : ''}`}
            >Next
            </button>
          </>
        )}

        {showAdditionalModal1 && !showAdditionalModal2 && (
          <>
            <label>Radius (miles)</label>
            <div><Slider aria-label="radius" valueLabelDisplay='on' min={1} max={50} step={1} value={radius} onChange={(e, value) => setRadius(value)}/></div>

            <div className="kids-container">
              <label className="kids-question-label">Do you have kids?</label>
              <div className="kids-answer-container">
                <label className="kids-label">
                  <input
                    type="radio"
                    name='kids'
                    value='true'
                    checked={kids === true}
                    onChange={() => setKids(true)}
                    required
                  /> Yes
                </label>

                <label className="kids-label">
                  <input
                    type="radio"
                    name='kids'
                    value='false'
                    checked={kids === false}
                    onChange={() => setKids(false)}
                    required
                  /> No
                </label>
                  {errors.kids && <p className="login-error-message">{errors.kids}</p>}
                  {validationErrors2.kids && <p className="login-error-message">{validationErrors2.kids}</p>}

              </div>

            </div>

            <div className="kids-container">
              <label className="kids-question-label">Do you have a backyard?</label>
              <div className="kids-answer-container">
                <label className="kids-label">
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
                  /> No
                </label>
                  {errors.hasBackyard && <p className="login-error-message">{errors.hasBackyard}</p>}
                  {validationErrors2.hasBackyard && <p className="login-error-message">{validationErrors2.hasBackyard}</p>}
              </div>

            </div>

            <div className="signup-otherPets-container">
              <label className="signup-otherPets-question-label">Do you have any other pets?</label>
                <div className="signup-otherPets-answer-container">
                <label className="signup-otherPets-label">
                  <input
                    type="radio"
                    name='otherPets'
                    value='none'
                    checked={otherPets === 'none'}
                    onChange={(e) => setOtherPets(e.target.value)}
                    required
                  />None
                </label>

                <label className="signup-otherPets-label">
                  <input
                    type="radio"
                    name='otherPets'
                    value='dogsOnly'
                    checked={otherPets === 'dogsOnly'}
                    onChange={(e) => setOtherPets(e.target.value)}
                    required
                  />Dogs Only
                </label>

                <label className="signup-otherPets-label">
                  <input
                    type="radio"
                    name='otherPets'
                    value='catsOnly'
                    checked={otherPets === 'catsOnly'}
                    onChange={(e) => setOtherPets(e.target.value)}
                    required
                  />Cats Only
                </label>

                <label className="signup-otherPets-label">
                  <input
                    type="radio"
                    name='otherPets'
                    value='both'
                    checked={otherPets === 'both'}
                    onChange={(e) => setOtherPets(e.target.value)}
                    required
                  />Both
                </label>

                <label className="signup-otherPets-label">
                  <input
                    type="radio"
                    name='otherPets'
                    value='other'
                    checked={otherPets === 'other'}
                    onChange={(e) => setOtherPets(e.target.value)}
                    required
                  />Other
                </label>
                  {errors.otherPets && <p className="login-error-message">{errors.otherPets}</p>}
                  {validationErrors2.otherPets && <p className="login-error-message">{validationErrors2.otherPets}</p>}
                </div>

            </div>


          <div className="signup-otherPets-container">
            <label className="signup-otherPets-question-label">What&apos;s your pet experience?</label>
            <div className="signup-otherPets-answer-container">
              <label className="signup-otherPets-label">
                <input
                  type="radio"
                  name='petExperience'
                  value='firstTime'
                  checked={petExperience === "firstTime"}
                  onChange={(e) => setPetExperience(e.target.value)}
                  required
                /> First Time
              </label>

              <label className="signup-otherPets-label">
                <input
                  type="radio"
                  name='petExperience'
                  value='previous'
                  checked={petExperience === "previous"}
                  onChange={(e) => setPetExperience(e.target.value)}
                  required
                /> Previous
              </label>

              <label className="signup-otherPets-label">
                <input
                  type="radio"
                  name='petExperience'
                  value='current'
                  checked={petExperience === "current"}
                  onChange={(e) => setPetExperience(e.target.value)}
                  required
                /> Current
              </label>
                {errors.petExperience && <p className="login-error-message">{errors.petExperience}</p>}
                {validationErrors2.petExperience && <p className="login-error-message">{validationErrors2.petExperience}</p>}
            </div>

          </div>
            <button type="button" onClick={() => setShowAdditionalModal1(false)}>Back</button>
            <button
              type="button"
              onClick={() => setShowAdditionalModal2(true)}
              disabled={Object.keys(validationErrors2).length > 0 || Object.keys(errors).length > 0}
              className={`next-button ${Object.keys(validationErrors2).length > 0 || Object.keys(errors).length > 0 ? 'disabled' : ''}`}
              >Next</button>


          </>

        )}

        {showAdditionalModal2 && (
          <>
            <h2>Dog Preferences (Optional)</h2>

          <div className="kids-container">
            <label className="kids-question-label">House Trained?</label>
            <div className="kids-answer-container">
              <label className="kids-label">
                <input
                  type="radio"
                  name='houseTrained'
                  value='true'
                  checked={houseTrained === true}
                  onChange={() => setHouseTrained(true)}
                /> Yes
              </label>

              <label className="kids-label">
                <input
                  type="radio"
                  name='houseTrained'
                  value='false'
                  checked={houseTrained === false}
                  onChange={() => setHouseTrained(false)}
                /> No
              </label>
            </div>

          </div>

          <div className="kids-container">
            <label className="kids-question-label">Special Needs?</label>
            <div className="kids-answer-container">
              <label className="kids-label">
                <input
                  type="radio"
                  name='specialNeeds'
                  value='true'
                  checked={specialNeeds === true}
                  onChange={() => setSpecialNeeds(true)}
                /> Yes
              </label>

              <label>
                <input
                  type="radio"
                  name='specialNeeds'
                  value='false'
                  checked={specialNeeds === false}
                  onChange={() => setSpecialNeeds(false)}
                /> No
              </label>
            </div>

          </div>

          <div className="signup-otherPets-container">
            <label className="signup-otherPets-question-label">What&apos;s your ideal age?</label>
            <div className="signup-otherPets-answer-container">
              <label className="signup-otherPets-label">
                <input
                  type="radio"
                  name='idealAge'
                  value='noPreference'
                  checked={idealAge === "noPreference"}
                  onChange={(e) => setIdealAge(e.target.value)}
                /> No Preference
              </label>

              <label className="signup-otherPets-label">
                <input
                  type="radio"
                  name='idealAge'
                  value='puppy'
                  checked={idealAge === "puppy"}
                  onChange={(e) => setIdealAge(e.target.value)}
                /> Puppy
              </label>

              <label className="signup-otherPets-label">
                <input
                  type="radio"
                  name='idealAge'
                  value='young'
                  checked={idealAge === "young"}
                  onChange={(e) => setIdealAge(e.target.value)}
                /> Young
              </label>

              <label className="signup-otherPets-label">
                <input
                  type="radio"
                  name='idealAge'
                  value='adult'
                  checked={idealAge === "adult"}
                  onChange={(e) => setIdealAge(e.target.value)}
                /> Adult
              </label>

              <label className="signup-otherPets-label">
                <input
                  type="radio"
                  name='idealAge'
                  value='senior'
                  checked={idealAge === "senior"}
                  onChange={(e) => setIdealAge(e.target.value)}
                /> Senior
              </label>

            </div>

          </div>

          <div className="signup-otherPets-container">
            <label className="signup-otherPets-question-label">What&apos;s your ideal sex?</label>
            <div className="signup-otherPets-answer-container">
              <label className="signup-otherPets-label">
                <input
                  type="radio"
                  name='idealSex'
                  value='noPreference'
                  checked={idealSex === "noPreference"}
                  onChange={(e) => setIdealSex(e.target.value)}
                /> No Preference
              </label>

              <label className="signup-otherPets-label">
                <input
                  type="radio"
                  name='idealSex'
                  value='male'
                  checked={idealSex === "male"}
                  onChange={(e) => setIdealSex(e.target.value)}
                /> Male
              </label>

              <label className="signup-otherPets-label">
                <input
                  type="radio"
                  name='idealSex'
                  value='female'
                  checked={idealSex === "female"}
                  onChange={(e) => setIdealSex(e.target.value)}
                /> Female
              </label>
            </div>

          </div>

          <div className="signup-otherPets-container">
            <label className="signup-otherPets-question-label">What&apos;s your ideal size?</label>
            <div className="signup-otherPets-answer-container">
              <label className="signup-otherPets-label">
                <input
                  type="radio"
                  name='idealSize'
                  value='noPreference'
                  checked={idealSize === "noPreference"}
                  onChange={(e) => setIdealSize(e.target.value)}
                /> No Preference
              </label>

              <label className="signup-otherPets-label">
                <input
                  type="radio"
                  name='idealSize'
                  value='small'
                  checked={idealSize === "small"}
                  onChange={(e) => setIdealSize(e.target.value)}
                /> Small
              </label>

              <label className="signup-otherPets-label">
                <input
                  type="radio"
                  name='idealSize'
                  value='medium'
                  checked={idealSize === "medium"}
                  onChange={(e) => setIdealSize(e.target.value)}
                /> Medium
              </label>

              <label className="signup-otherPets-label">
                <input
                  type="radio"
                  name='idealSize'
                  value='large'
                  checked={idealSize === "large"}
                  onChange={(e) => setIdealSize(e.target.value)}
                /> Large
              </label>

              <label className="signup-otherPets-label">
                <input
                  type="radio"
                  name='idealSize'
                  value='xl'
                  checked={idealSize === "xl"}
                  onChange={(e) => setIdealSize(e.target.value)}
                /> XLarge
              </label>
            </div>

          </div>

          <div className="signup-otherPets-container">
            <label className="signup-otherPets-answer-label">What&apos;s your ideal lifestyle?</label>
            <div className="signup-otherPets-answer-container">
              <label className="signup-otherPets-label">
                <input
                  type="radio"
                  name='lifestyle'
                  value='noPreference'
                  checked={lifestyle === "noPreference"}
                  onChange={(e) => setLifestyle(e.target.value)}
                /> No Preference
              </label>

              <label className="signup-otherPets-label">
                <input
                  type="radio"
                  name='lifestyle'
                  value='veryActive'
                  checked={lifestyle === "veryActive"}
                  onChange={(e) => setLifestyle(e.target.value)}
                /> Very Active
              </label>

              <label className="signup-otherPets-label">
                <input
                  type="radio"
                  name='lifestyle'
                  value='active'
                  checked={lifestyle === "active"}
                  onChange={(e) => setLifestyle(e.target.value)}
                /> Active
              </label>

              <label className="signup-otherPets-label">
                <input
                  type="radio"
                  name='lifestyle'
                  value='laidback'
                  checked={lifestyle === "laidback"}
                  onChange={(e) => setLifestyle(e.target.value)}
                /> Laid-back
              </label>

              <label className="signup-otherPets-label">
                <input
                  type="radio"
                  name='lifestyle'
                  value='lapPet'
                  checked={lifestyle === "lapPet"}
                  onChange={(e) => setLifestyle(e.target.value)}
                /> Lap Pet
              </label>
            </div>

          </div>

            <button type="button" onClick={() => {
              setShowAdditionalModal2(false)
              setShowAdditionalModal1(true)
            }}>Back</button>
            <button type="submit">Sign Up</button>
          </>

        )}

      </form>
    </div>
  );
}

export default SignupFormModal;
