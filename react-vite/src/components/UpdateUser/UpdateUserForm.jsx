import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { editUserThunk, thunkAuthenticate } from "../../redux/session";
import { useModal } from "../../context/Modal";
import Slider from '@mui/material/Slider'
import "../SignupFormModal/SignupForm.css";
import "./UpdateUser.css"
import { useNavigate } from "react-router-dom";


const UpdateUserForm = ({user}) => {
  const dispatch = useDispatch()
  const {closeModal} = useModal()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("")
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || "")
  const [kids, setKids] = useState(null)
  const [hasBackyard, setHasBackyard] = useState(null)
  const [otherPets, setOtherPets] = useState(null)
  const [petExperience, setPetExperience] = useState(null)
  const [location, setLocation] = useState({latitude: null, longitude: null});
  const [radius, setRadius] = useState(5)
  const [errors, setErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState({})
  const [validationErrors2, setValidationErrors2] = useState({})
  const [loadingLocation, setLoadingLocation] = useState(false)

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  useEffect(() => {
      if (user) {
          // console.log('user data from editing profile', user)

          setFirstName(user.firstName || "")
          setLastName(user.lastName || "")
          setUsername(user.username || "")
          setEmail(user.email || "")
          setPassword(user.password || "")
          setAvatar(user.avatar || "")
          setKids(user.kids ?? false)
          setHasBackyard(user.hasBackyard ?? false)
          setOtherPets(user.otherPets || null)
          setPetExperience(user.petExperience || null)
          setLocation(user.location || {latitude: null, longitude: null})
          setRadius(user.radius || 5)

          setHouseTrained(user.dogPreferences?.houseTrained || null)
          setSpecialNeeds(user.dogPreferences?.specialNeeds || null)
          setIdealAge(user.dogPreferences?.idealAge || null)
          setIdealSex(user.dogPreferences?.idealSex || null)
          setIdealSize(user.dogPreferences?.idealSize || null)
          setLifestyle(user.dogPreferences?.lifestyle || null)
      }
  }, [user])

  const updateFirstName = (e) => setFirstName(e.target.value)
  const updateLastName = (e) => setLastName(e.target.value)
  const updateUsername = (e) => setUsername(e.target.value)
  const updateEmail = (e) => setEmail(e.target.value)
  // const updatePassword = (e) => setPassword(e.target.value)
  const updateKids = (e) => setKids(e.target.value === 'true' ? true : false)
  const updateHasBackyard = (e) => setHasBackyard(e.target.value === 'true' ? true : false)
  const updateOtherPets = (e) => setOtherPets(e.target.value)
  const updatePetExperience = (e) => setPetExperience(e.target.value)
  const updateHouseTrained = (e) => setHouseTrained(e.target.value === 'true' ? true : false)
  const updateSpecialNeeds = (e) => setSpecialNeeds(e.target.value === 'true' ? true : false)
  const updateIdealAge = (e) => setIdealAge(e.target.value)
  const updateIdealSex = (e) => setIdealSex(e.target.value)
  const updateIdealSize = (e) => setIdealSize(e.target.value)
  const updateLifestyle = (e) => setLifestyle(e.target.value)
  const updateAvatar = (e) => {
      const newAvatarUrl = e.target.value.trim()
      setAvatar(newAvatarUrl)
      setAvatarPreview(newAvatarUrl)
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      setErrors((prev) => ({ ...prev, location: "Geolocation is not supported by your browser"}))
      return
    }

    setLoadingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // console.log('location fetched:', position.coords.latitude, position.coords.longitude)
          setLocation({latitude: position.coords.latitude, longitude: position.coords.longitude})
          setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors.location
            return newErrors
          })
          setLoadingLocation(false)
      },
      (error) => {
          console.log('error fetching location', error.message)
          setErrors((prev) => ({ ...prev, location: error.message}))
          setLoadingLocation(false)
      }
    )
  }, [])


  const updateRadius = (event, newVal) => setRadius(newVal)

  // client side validations
  useEffect(() => {
    const newErrors = {}

    if (!firstName.trim()) newErrors.firstName = "First name is required"
    if (!lastName.trim()) newErrors.lastName = "Last name is required"
    if (!username.trim()) newErrors.username = "Username is required"
    if (email && !validateEmail(email)) newErrors.email = "Please provide a valid email address";
    if (password && password.length < 6) newErrors.password = "Password must be at least 6 characters long";
    if (!avatar.trim()) newErrors.avatar = "Profile picture is required"
    if (!location) newErrors.location = "Location is required"

    setValidationErrors(newErrors)
  }, [firstName, lastName, username, email, password, avatar, location])

  useEffect(() => {
    const newErrors = {}

    if (!location) newErrors.location = "Location is required"
    if (kids === null) newErrors.kids = "Please answer question."
    if (hasBackyard === null) newErrors.hasBackyard = "Please answer question."
    if (otherPets === null) newErrors.otherPets = "Please answer question."
    if (petExperience === null) newErrors.petExperience = "Please answer question"

    setValidationErrors2(newErrors)

  }, [kids, hasBackyard, otherPets, petExperience, location])


    const handleSubmit = async (e) => {
        e.preventDefault()

        const newErrors = {};
        if (!firstName.trim()) newErrors.firstName = "First name is required"
        if (!lastName.trim()) newErrors.lastName = "Last name is required"
        if (!username.trim()) newErrors.username = "Username is required"
        if (email && !validateEmail(email)) newErrors.email = "Please provide a valid email address";
        if (password && password.length < 6) newErrors.password = "Password must be at least 6 characters long";
        if (!avatar.trim()) newErrors.avatar = "Profile picture is required"
        if (kids === null) newErrors.kids = "Please answer question."
        if (hasBackyard === null) newErrors.hasBackyard = "Please answer question."
        if (otherPets === null) newErrors.otherPets = "Please answer question."
        if (petExperience === null) newErrors.petExperience = "Please answer question"

        // console.log('looooooooooooook here for errors specifically location', newErrors)
        if (Object.keys(newErrors).length > 0) {
            return setErrors((prev) => ({ ...prev, ...newErrors}))
        }

          setErrors({});
          setValidationErrors({});

          const serverResponse = await dispatch(
            editUserThunk({
                userId: user.id,
                firstName,
                lastName,
                username,
                email,
                password,
                avatar,
                kids: Boolean(kids),
                hasBackyard: Boolean(hasBackyard),
                otherPets,
                petExperience,
                latitude: location.latitude,
                longitude: location.longitude,
                radius,
                dogPreferences
            })
          )

          // console.log('serverResponse', serverResponse)
          if (serverResponse) {
            if(serverResponse.errors) setErrors(serverResponse.errors)
            else if (typeof serverResponse === 'object') setErrors(serverResponse)
            else setErrors({ general: serverResponse })


            if (!serverResponse.errors) {
                dispatch(thunkAuthenticate()).then(() => {
                  closeModal()
                  navigate(`/user/${user.id}`)
                })
            }
          }
    }
    // console.log('validationerrors', validationErrors, errors)
    // console.log('validationErrors2', validationErrors2)

    return (
        <div className="signup-modal">

          <form className="signup-form" onSubmit={handleSubmit}>
            {!showAdditionalModal1 && (
              <>

                <div className="signup-header">
                  <h1>Edit Profile</h1>
                </div>
                {errors.general && (
                  <div className="error-banner">
                    {errors.general}
                  </div>
                )}

                {/* <div className='profile-container'> */}
                  <label className='profile-label'>
                      Profile Picture
                      <input type="text" value={avatar || ""} onChange={updateAvatar}/>
                      {validationErrors.avatar && <p className="login-error-message">{validationErrors.avatar}</p>}
                  </label>

                  {/* Show Image Preview */}
                  {avatar && !errors.avatar && (
                    <img src={avatarPreview} alt="Avatar Preview" className="avatar-preview"/>
                  )}
                {/* </div> */}
                {errors.avatar && <p className="error-message">{errors.avatar}</p>}

              <div className='first-last-name-container'>
                <label className='first-last-name-label'>
                    First Name
                    <input
                      type="text"
                      value={firstName}
                      onChange={updateFirstName}
                      required
                    />

                    {errors.firstName && <p className="signup-error-message">{errors.firstName}</p>}
                    {validationErrors.firstName && <p className="login-error-message">{validationErrors.firstName}</p>}
                </label>

                <label>
                    Last Name
                    <input
                      type="text"
                      value={lastName}
                      onChange={updateLastName}
                      required
                    />
                    {errors.lastName && <p className="signup-error-message">{errors.lastName}</p>}
                    {validationErrors.lastName && <p className="login-error-message">{validationErrors.lastName}</p>}
                </label>
              </div>

                <label>
                  Username
                  <input
                    type="text"
                    value={username}
                    onChange={updateUsername}
                    className={errors.username ? 'error' : ''}
                    required
                  />
                  {errors.username && <p className="signup-error-message">{errors.username}</p>}
                  {validationErrors.username && <p className="login-error-message">{validationErrors.username}</p>}
                </label>

                <label>
                  Email
                  <input
                    type="text"
                    value={email}
                    onChange={updateEmail}
                    className={errors.email ? 'error' : ''}
                    required
                  />
                  {errors.email && <p className="signup-error-message">{errors.email}</p>}
                  {validationErrors.email && <p className="signup-error-message">{validationErrors.email}</p>}
                </label>

                {/* <label>
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={updatePassword}
                    placeholder="Password"
                    required
                  />
                  {errors.password && <p className="signup-error-message">{errors.password}</p>}
                  {validationErrors.password && <p className="signup-error-message">{validationErrors.password}</p>}
                </label> */}
                <button
                  type="button"
                  onClick={() => setShowAdditionalModal1(true)}
                  disabled={Object.keys(validationErrors).length > 0 || Object.keys(errors).length > 0}
                  className={`next-button ${Object.keys(validationErrors).length > 0 || Object.keys(errors).length > 0 ? 'disabled' : ''}`}>
                    Next
                </button>
              </>
            )}

            {showAdditionalModal1 && !showAdditionalModal2 && (
              <>
                {/* <div className='kids-container'> */}
                  <label className='location-label'>Radius (miles)</label>

                  {/* <label className='location-label'>
                      <button type="button" className='use-location-button' onClick={updateLocation} disabled={loadingLocation}>
                          {loadingLocation ? "Fetching Location..." : "Use Current Location"}
                      </button>
                  </label> */}
                  {errors.location && <p className="error-message">{errors.location}</p>}
                {/* </div> */}

                <div>
                    <Slider
                    aria-label="radius"
                    value={radius}
                    onChange={updateRadius}
                    valueLabelDisplay='on'
                    min={1}
                    max={50}
                    step={1}
                    />
                </div>

              <div className='kids-container'>
                <label className='kids-question-label'>Do you have kids?</label>
                <div className='kids-answer-container'>
                  <label className='kids-label'>
                    <input
                      type="radio"
                      name='kids'
                      value='true'
                      checked={kids === true}
                      onChange={updateKids}
                      required
                    /> Yes
                  </label>

                  <label className='kids-label'>
                    <input
                      type="radio"
                      name='kids'
                      value='false'
                      checked={kids === false}
                      onChange={updateKids}
                      required
                    /> No
                  </label>
                    {errors.kids && <p className="signup-error-message">{errors.kids}</p>}
                    {validationErrors2.kids && <p className="signup-error-message">{validationErrors2.kids}</p>}

                </div>
              </div>

              <div className='kids-container'>
                <label className='kids-question-label'>Do you have a backyard?</label>
                <div className='kids-answer-container'>
                  <label className='kids-label'>
                    <input
                      type="radio"
                      name='hasBackyard'
                      value='true'
                      checked={hasBackyard === true}
                      onChange={updateHasBackyard}
                      required
                    /> Yes
                  </label>

                  <label>
                    <input
                      type="radio"
                      name='hasBackyard'
                      value='false'
                      checked={hasBackyard === false}
                      onChange={updateHasBackyard}
                      required
                    /> No
                  </label>
                    {errors.hasBackyard && <p className="signup-error-message">{errors.hasBackyard}</p>}
                    {validationErrors2.hasBackyard && <p className="signup-error-message">{validationErrors2.hasBackyard}</p>}
                </div>
              </div>

              <div className='signup-otherPets-container'>
                <label className='signup-otherPets-question-label'>Do you have any other pets?</label>
                  <div className='signup-otherPets-answer-container'>
                  <label className='signup-otherPets-label'>
                    <input
                      type="radio"
                      name='otherPets'
                      value='none'
                      checked={otherPets === 'none'}
                      onChange={updateOtherPets}
                      required
                    />None
                  </label>

                  <label className='signup-otherPets-label'>
                    <input
                      type="radio"
                      name='otherPets'
                      value='dogsOnly'
                      checked={otherPets === 'dogsOnly'}
                      onChange={updateOtherPets}
                      required
                    />Dogs Only
                  </label>

                  <label className='signup-otherPets-label'>
                    <input
                      type="radio"
                      name='otherPets'
                      value='catsOnly'
                      checked={otherPets === 'catsOnly'}
                      onChange={updateOtherPets}
                      required
                    />Cats Only
                  </label>

                  <label className='signup-otherPets-label'>
                    <input
                      type="radio"
                      name='otherPets'
                      value='both'
                      checked={otherPets === 'both'}
                      onChange={updateOtherPets}
                      required
                    />Both
                  </label>

                  <label className='signup-otherPets-label'>
                    <input
                      type="radio"
                      name='otherPets'
                      value='other'
                      checked={otherPets === 'other'}
                      onChange={updateOtherPets}
                      required
                    />Other
                  </label>
                    {errors.otherPets && <p className="signup-error-message">{errors.otherPets}</p>}
                    {validationErrors2.otherPets && <p className="signup-error-message">{validationErrors2.otherPets}</p>}
                  </div>
              </div>

              <div className='signup-otherPets-container'>
                <label className='signup-otherPets-question-label'>What&apos;s your pet experience?</label>
                <div className="signup-otherPets-answer-container">
                  <label className='signup-otherPets-label'>
                    <input
                      type="radio"
                      name='petExperience'
                      value='firstTime'
                      checked={petExperience === "firstTime"}
                      onChange={updatePetExperience}
                      required
                    /> First Time
                  </label>

                  <label className='signup-otherPets-label'>
                    <input
                      type="radio"
                      name='petExperience'
                      value='previous'
                      checked={petExperience === "previous"}
                      onChange={updatePetExperience}
                      required
                    /> Previous
                  </label>

                  <label className='signup-otherPets-label'>
                    <input
                      type="radio"
                      name='petExperience'
                      value='current'
                      checked={petExperience === "current"}
                      onChange={updatePetExperience}
                      required
                    /> Current
                  </label>
                    {errors.petExperience && <p className="signup-error-message">{errors.petExperience}</p>}
                    {validationErrors2.petExperience && <p className="signup-error-message">{validationErrors2.petExperience}</p>}
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
                <h1 style={{fontSize:"25px", padding:"0px"}}>Dog Preferences <span style={{fontSize:"15px"}}>(Optional)</span></h1>

                <div className='preferences-container'>
                  <label className='preferences-question-label'>House Trained?</label>
                  <div className='preferences-answer-container'>
                    <label className='preferences-label'>
                      <input
                        type="radio"
                        name='houseTrained'
                        value='true'
                        checked={houseTrained === true}
                        onChange={updateHouseTrained}
                      /> Yes
                    </label>

                    <label className='preferences-label'>
                      <input
                        type="radio"
                        name='houseTrained'
                        value='false'
                        checked={houseTrained === false}
                        onChange={updateHouseTrained}

                      /> No
                    </label>
                  </div>
                </div>

                <div className='preferences-container'>
                  <label className='preferences-question-label'>Special Needs?</label>
                  <div className='preferences-answer-container'>
                    <label className='preferences-label'>
                      <input
                        type="radio"
                        name='specialNeeds'
                        value='true'
                        checked={specialNeeds === true}
                        onChange={updateSpecialNeeds}
                      /> Yes
                    </label>

                    <label className='preferences-label'>
                      <input
                        type="radio"
                        name='specialNeeds'
                        value='false'
                        checked={specialNeeds === false}
                        onChange={updateSpecialNeeds}
                      /> No
                    </label>
                  </div>
                </div>

                <div className='preferences-container'>
                  <label className='preferences-question-label'>Ideal sex?</label>
                  <div className='preferences-answer-container'>
                    {/* <label className='preferences-otherPets-label'>
                      <input
                        type="radio"
                        name='idealSex'
                        value='noPreference'
                        checked={idealSex === "noPreference"}
                        onChange={updateIdealSex}
                        required
                      /> No Preference
                    </label> */}

                    <label className='preferences-label'>
                      <input
                        type="radio"
                        name='idealSex'
                        value='male'
                        checked={idealSex === "male"}
                        onChange={updateIdealSex}
                      /> Male
                    </label>

                    <label className='preferences-label'>
                      <input
                        type="radio"
                        name='idealSex'
                        value='female'
                        checked={idealSex === "female"}
                        onChange={updateIdealSex}

                      /> Female
                    </label>
                  </div>

                </div>

                <div className='preferences-otherPets-container'>
                  <label className='preferences-otherPets-question-label'>Ideal age?</label>
                  <div className='preferences-otherPets-answer-container'>
                    {/* <label className='preferences-otherPets-label'>
                      <input
                        type="radio"
                        name='idealAge'
                        value='noPreference'
                        checked={idealAge === "noPreference"}
                        onChange={updateIdealAge}
                        required
                      /> No Preference
                    </label> */}

                    <label className='preferences-otherPets-label'>
                      <input
                        type="radio"
                        name='idealAge'
                        value='puppy'
                        checked={idealAge === "puppy"}
                        onChange={updateIdealAge}
                      /> Puppy
                    </label>

                    <label className='preferences-otherPets-label'>
                      <input
                        type="radio"
                        name='idealAge'
                        value='young'
                        checked={idealAge === "young"}
                        onChange={updateIdealAge}

                      /> Young
                    </label>

                    <label className='preferences-otherPets-label'>
                      <input
                        type="radio"
                        name='idealAge'
                        value='adult'
                        checked={idealAge === "adult"}
                        onChange={updateIdealAge}

                      /> Adult
                    </label>

                    <label className='preferences-otherPets-label'>
                      <input
                        type="radio"
                        name='idealAge'
                        value='senior'
                        checked={idealAge === "senior"}
                        onChange={updateIdealAge}
                      /> Senior
                    </label>

                  </div>
                </div>


                <div className='preferences-otherPets-container'>
                  <label className='preferences-otherPets-question-label'>Ideal size?</label>
                  <div className='preferences-otherPets-answer-container'>
                    {/* <label className='preferences-otherPets-label'>
                      <input
                        type="radio"
                        name='idealSize'
                        value='noPreference'
                        checked={idealSize === "noPreference"}
                        onChange={updateIdealSize}
                        required
                      /> No Preference
                    </label> */}

                    <label className='preferences-otherPets-label'>
                      <input
                        type="radio"
                        name='idealSize'
                        value='small'
                        checked={idealSize === "small"}
                        onChange={updateIdealSize}
                      /> Small
                    </label>

                    <label className='preferences-otherPets-label'>
                      <input
                        type="radio"
                        name='idealSize'
                        value='medium'
                        checked={idealSize === "medium"}
                        onChange={updateIdealSize}

                      /> Medium
                    </label>

                    <label className='preferences-otherPets-label'>
                      <input
                        type="radio"
                        name='idealSize'
                        value='large'
                        checked={idealSize === "large"}
                        onChange={updateIdealSize}

                      /> Large
                    </label>

                    <label className='preferences-otherPets-label'>
                      <input
                        type="radio"
                        name='idealSize'
                        value='xl'
                        checked={idealSize === "xl"}
                        onChange={updateIdealSize}

                      /> XLarge
                    </label>
                  </div>

                </div>

                <div className='preferences-otherPets-container'>
                  <label className='preferences-otherPets-question-label'>Ideal lifestyle?</label>
                  <div className='preferences-otherPets-answer-container'>
                    {/* <label className='preferences-otherPets-label'>
                      <input
                        type="radio"
                        name='lifestyle'
                        value='noPreference'
                        checked={lifestyle === "noPreference"}
                        onChange={updateLifestyle}
                        required
                      /> No Preference
                    </label> */}

                    <label className='preferences-otherPets-label'>
                      <input
                        type="radio"
                        name='lifestyle'
                        value='veryActive'
                        checked={lifestyle === "veryActive"}
                        onChange={updateLifestyle}

                      /> Very Active
                    </label>

                    <label className='preferences-otherPets-label'>
                      <input
                        type="radio"
                        name='lifestyle'
                        value='active'
                        checked={lifestyle === "active"}
                        onChange={updateLifestyle}

                      /> Active
                    </label>

                    <label className='preferences-otherPets-label'>
                      <input
                        type="radio"
                        name='lifestyle'
                        value='laidback'
                        checked={lifestyle === "laidback"}
                        onChange={updateLifestyle}

                      /> Laid-back
                    </label>

                    <label className='preferences-otherPets-label'>
                      <input
                        type="radio"
                        name='lifestyle'
                        value='lapPet'
                        checked={lifestyle === "lapPet"}
                        onChange={updateLifestyle}

                      /> Lap Pet
                    </label>
                  </div>

                </div>

                <button type="button" onClick={() => {
                  setShowAdditionalModal2(false)
                  setShowAdditionalModal1(true)
                }}>Back</button>
                <button onClick={handleSubmit} type="submit">Save Changes</button>
              </>

            )}

          </form>
        </div>
      );
}

export default UpdateUserForm
