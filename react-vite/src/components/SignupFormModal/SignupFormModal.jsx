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
  const [radius, setRadius] = useState(5.0)
  const [errors, setErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState({})

  const [showAdditionalModal1, setShowAdditionalModal1] = useState(false)
  const [showAdditionalModal2, setShowAdditionalModal2] = useState(false)
  const [houseTrained, setHouseTrained] = useState(null)
  const [specialNeeds, setSpecialNeeds] = useState(null)
  const [idealAge, setIdealAge] = useState(null)
  const [idealSex, setIdealSex] = useState(null)
  const [idealSize, setIdealSize] = useState(null)
  const [lifestyle, setLifestyle] = useState(null)

  const navigate = useNavigate()

  const dogPreferences = {
    houseTrained,
    specialNeeds,
    idealAge,
    idealSex,
    idealSize,
    lifestyle,
  };

  const { closeModal } = useModal();

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
    // if (password && confirmPassword && password !== confirmPassword) newErrors.confirmPassword = "Passwords must match";
    // if (password && password.length < 6) newErrors.password = "Password must be at least 6 characters long";
    if (kids === null) newErrors.kids = "Please answer question."
    if (hasBackyard === null) newErrors.hasBackyard = "Please answer question."
    if (otherPets.length === 0) newErrors.otherPets = "Please make selection(s)"
    if (petExperience === null) newErrors.petExperience = "Please answer question"


    setValidationErrors(newErrors);
  }, [firstName, lastName, username, email, kids, hasBackyard, otherPets, petExperience]);


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
      dogPreferences,  // <-- Debugging output
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

  const handleOtherPetsChange = (e) => {
    const {value, checked} = e.target
    setOtherPets((prev) =>
      checked ? [...prev, value] : prev.filter((pet) => pet !== value)
    )
  }

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

            <label>
                Avatar
                <input type="text" placeholder="Avatar" value={avatar} onChange={(e) => setAvatar(e.target.value)} />
            </label>

            {/* Show Image Preview */}
            {avatar && !errors.avatar && (
              <img src={avatar} alt="Avatar Preview" className="avatar-preview"/>
            )}
            {errors.avatar && <p className="error-message">{errors.avatar}</p>}



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
            <button type="button" onClick={() => setShowAdditionalModal1(true)}>Next</button>
          </>
        )}

        {showAdditionalModal1 && !showAdditionalModal2 && (
          <>
            <label>Radius</label>
            <div><Slider aria-label="radius" value={radius} onChange={(e, value) => setRadius(value)}/></div>

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
                /> No
              </label>
                {errors.hasBackyard && <p className="signup-error-message">{errors.hasBackyard}</p>}
                {validationErrors.hasBackyard && <p className="signup-error-message">{validationErrors.hasBackyard}</p>}
            </div>

            <label>Do you have any other pets?</label>
              <div>
                <input
                  type="checkbox"
                  id='none'
                  value='none'
                  checked={otherPets.includes("none")}
                  onChange={handleOtherPetsChange}
                  required
                />
                <label htmlFor='none'>None</label>

                <input
                  type="checkbox"
                  id='dogs'
                  value='dogsOnly'
                  checked={otherPets.includes("dogsOnly")}
                  onChange={handleOtherPetsChange}
                  required
                />
                <label htmlFor='dogs'>Dogs Only</label>

                <input
                  type="checkbox"
                  id='cats'
                  value='catsOnly'
                  checked={otherPets.includes("catsOnly")}
                  onChange={handleOtherPetsChange}
                  required
                />
                <label htmlFor='cats'>Cats Only</label>

                <input
                  type="checkbox"
                  id='both'
                  value='both'
                  checked={otherPets.includes("both")}
                  onChange={handleOtherPetsChange}
                  required
                />
                <label htmlFor='both'>Both</label>

                <input
                  type="checkbox"
                  id='other'
                  value='other'
                  checked={otherPets.includes("other")}
                  onChange={handleOtherPetsChange}
                  required
                />
                <label htmlFor='other'>Other Only</label>
              </div>

                {errors.otherPets && <p className="signup-error-message">{errors.otherPets}</p>}
                {validationErrors.otherPets && <p className="signup-error-message">{validationErrors.otherPets}</p>}


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
                /> Current
              </label>
                {errors.petExperience && <p className="signup-error-message">{errors.petExperience}</p>}
                {validationErrors.petExperience && <p className="signup-error-message">{validationErrors.petExperience}</p>}
            </div>
            <button type="button" onClick={() => setShowAdditionalModal1(false)}>Back</button>
            <button type="button" onClick={() => setShowAdditionalModal2(true)}>Next</button>


          </>

        )}

        {showAdditionalModal2 && (
          <>
            <h2>Dog Preferences (Optional)</h2>

            <label>House Trained?</label>
            <div>
              <label>
                <input
                  type="radio"
                  name='houseTrained'
                  value='true'
                  checked={houseTrained === true}
                  onChange={() => setHouseTrained(true)}
                  required
                /> Yes
              </label>

              <label>
                <input
                  type="radio"
                  name='houseTrained'
                  value='false'
                  checked={houseTrained === false}
                  onChange={() => setHouseTrained(false)}
                  required
                /> No
              </label>
            </div>

            <label>Special Needs?</label>
            <div>
              <label>
                <input
                  type="radio"
                  name='specialNeeds'
                  value='true'
                  checked={specialNeeds === true}
                  onChange={() => setSpecialNeeds(true)}
                  required
                /> Yes
              </label>

              <label>
                <input
                  type="radio"
                  name='specialNeeds'
                  value='false'
                  checked={specialNeeds === false}
                  onChange={() => setSpecialNeeds(false)}
                  required
                /> No
              </label>
            </div>

            <label>What's your ideal age?</label>
            <div>
              <label>
                <input
                  type="radio"
                  name='idealAge'
                  value='noPreference'
                  checked={idealAge === "noPreference"}
                  onChange={(e) => setIdealAge(e.target.value)}
                  required
                /> No Preference
              </label>

              <label>
                <input
                  type="radio"
                  name='idealAge'
                  value='puppy'
                  checked={idealAge === "puppy"}
                  onChange={(e) => setIdealAge(e.target.value)}
                  required
                /> Puppy
              </label>

              <label>
                <input
                  type="radio"
                  name='idealAge'
                  value='young'
                  checked={idealAge === "young"}
                  onChange={(e) => setIdealAge(e.target.value)}
                  required
                /> Young
              </label>

              <label>
                <input
                  type="radio"
                  name='idealAge'
                  value='adult'
                  checked={idealAge === "adult"}
                  onChange={(e) => setIdealAge(e.target.value)}
                  required
                /> Adult
              </label>

              <label>
                <input
                  type="radio"
                  name='idealAge'
                  value='senior'
                  checked={idealAge === "senior"}
                  onChange={(e) => setIdealAge(e.target.value)}
                  required
                /> Senior
              </label>

            </div>

            <label>What's your ideal sex?</label>
            <div>
              <label>
                <input
                  type="radio"
                  name='idealSex'
                  value='noPreference'
                  checked={idealSex === "noPreference"}
                  onChange={(e) => setIdealSex(e.target.value)}
                  required
                /> No Preference
              </label>

              <label>
                <input
                  type="radio"
                  name='idealSex'
                  value='male'
                  checked={idealSex === "male"}
                  onChange={(e) => setIdealSex(e.target.value)}
                  required
                /> Male
              </label>

              <label>
                <input
                  type="radio"
                  name='idealSex'
                  value='female'
                  checked={idealSex === "female"}
                  onChange={(e) => setIdealSex(e.target.value)}
                  required
                /> Female
              </label>
            </div>

            <label>What's your ideal size?</label>
            <div>
              <label>
                <input
                  type="radio"
                  name='idealSize'
                  value='noPreference'
                  checked={idealSize === "noPreference"}
                  onChange={(e) => setIdealSize(e.target.value)}
                  required
                /> No Preference
              </label>

              <label>
                <input
                  type="radio"
                  name='idealSize'
                  value='small'
                  checked={idealSize === "small"}
                  onChange={(e) => setIdealSize(e.target.value)}
                  required
                /> Small
              </label>

              <label>
                <input
                  type="radio"
                  name='idealSize'
                  value='medium'
                  checked={idealSize === "medium"}
                  onChange={(e) => setIdealSize(e.target.value)}
                  required
                /> Medium
              </label>

              <label>
                <input
                  type="radio"
                  name='idealSize'
                  value='large'
                  checked={idealSize === "large"}
                  onChange={(e) => setIdealSize(e.target.value)}
                  required
                /> Large
              </label>

              <label>
                <input
                  type="radio"
                  name='idealSize'
                  value='xl'
                  checked={idealSize === "xl"}
                  onChange={(e) => setIdealSize(e.target.value)}
                  required
                /> XLarge
              </label>
            </div>

            <label>What's your ideal lifestyle?</label>
            <div>
              <label>
                <input
                  type="radio"
                  name='lifestyle'
                  value='noPreference'
                  checked={lifestyle === "noPreference"}
                  onChange={(e) => setLifestyle(e.target.value)}
                  required
                /> No Preference
              </label>

              <label>
                <input
                  type="radio"
                  name='lifestyle'
                  value='veryActive'
                  checked={lifestyle === "veryActive"}
                  onChange={(e) => setLifestyle(e.target.value)}
                  required
                /> Very Active
              </label>

              <label>
                <input
                  type="radio"
                  name='lifestyle'
                  value='active'
                  checked={lifestyle === "active"}
                  onChange={(e) => setLifestyle(e.target.value)}
                  required
                /> Active
              </label>

              <label>
                <input
                  type="radio"
                  name='lifestyle'
                  value='laidback'
                  checked={lifestyle === "laidback"}
                  onChange={(e) => setLifestyle(e.target.value)}
                  required
                /> Laid-back
              </label>

              <label>
                <input
                  type="radio"
                  name='lifestyle'
                  value='lapPet'
                  checked={lifestyle === "lapPet"}
                  onChange={(e) => setLifestyle(e.target.value)}
                  required
                /> Lap Pet
              </label>
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
