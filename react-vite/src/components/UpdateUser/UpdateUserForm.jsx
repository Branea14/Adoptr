import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { editUserThunk, thunkAuthenticate } from "../../redux/session";
import { useModal } from "../../context/Modal";
import Slider from '@mui/material/Slider'
import "../SignupFormModal/SignupForm.css";
import "./UpdateUser.css"


const UpdateUserForm = ({user}) => {
    const dispatch = useDispatch()
    const {closeModal} = useModal()

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


    useEffect(() => {
        if (user) {
            console.log('user data from editing profile', user)

            setFirstName(user.firstName || "")
            setLastName(user.lastName || "")
            setUsername(user.username || "")
            setEmail(user.email || "")
            setPassword(user.password || "")
            setAvatar(user.avatar || "")
            setKids(user.kids || null)
            setHasBackyard(user.hasBackyard || null)
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

    const updateAvatar = (e) => {
        const newAvatarUrl = e.target.value.trim()
        setAvatar(newAvatarUrl)
        setAvatarPreview(newAvatarUrl)
    }

    const updateLocation = () => {
        if (!navigator.geolocation) {
          setErrors((prev) => ({ ...prev, location: "Geolocation is not supported by your browser"}))
          return
        }

        setLoadingLocation(true)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({latitude: position.coords.latitude, longitude: position.coords.longitude})
                setErrors((prev) => ({ ...prev, location: null}))
                setLoadingLocation(false)
            },
            (error) => {
                setErrors((prev) => ({ ...prev, location: error.message}))
                setLoadingLocation(false)
            }
        )
    }

    const updateRadius = (event, newVal) => setRadius(newVal)

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

    const updateFirstName = (e) => setFirstName(e.target.value)
    const updateLastName = (e) => setLastName(e.target.value)
    const updateUsername = (e) => setUsername(e.target.value)
    const updateEmail = (e) => setEmail(e.target.value)
    const updatePassword = (e) => setPassword(e.target.value)
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




    useEffect(() => {
        const newErrors = {}

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

    }, [firstName, lastName, username, email, password, avatar, kids, hasBackyard, otherPets, petExperience])


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

        if (Object.keys(newErrors).length > 0) {
            return setErrors((prev) => ({ ...prev, ...newErrors}))
        }

          setErrors({});
          setValidationErrors({});

          const serverResponse = await dispatch(
            editUserThunk({
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

          if (serverResponse) {
            if(serverResponse.errors) setErrors(serverResponse.errors)
            else if (typeof serverResponse === 'object') setErrors(serverResponse)
            else setErrors({ general: serverResponse })

            if (!serverResponse.errors) {
                dispatch(thunkAuthenticate())
                closeModal()
            }
          }
    }

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

                <label>
                    Avatar
                    <input type="text" placeholder="Avatar" value={avatar || ""} onChange={updateAvatar} width="50"/>
                </label>

                {/* Show Image Preview */}
                {avatar && !errors.avatar && (
                  <img src={avatarPreview} alt="Avatar Preview" className="avatar-preview"/>
                )}
                {errors.avatar && <p className="error-message">{errors.avatar}</p>}



                <label>
                  Username
                  <input
                    type="text"
                    value={username}
                    onChange={updateUsername}
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
                    onChange={updateFirstName}
                    placeholder="First Name"
                    required
                  />
                  {errors.firstName && <p className="signup-error-message">{errors.firstName}</p>}
                </label>

                <label>
                  Last Name
                  <input
                    type="text"
                    value={lastName}
                    onChange={updateLastName}
                    placeholder="Last Name"
                    required
                  />
                  {errors.lastName && <p className="signup-error-message">{errors.lastName}</p>}
                </label>

                <label>
                  Email
                  <input
                    type="text"
                    value={email}
                    onChange={updateEmail}
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
                    onChange={updatePassword}
                    placeholder="Password"
                    required
                  />
                  {errors.password && <p className="signup-error-message">{errors.password}</p>}
                  {validationErrors.password && <p className="signup-error-message">{validationErrors.password}</p>}
                </label>
                <button type="button" onClick={() => setShowAdditionalModal1(true)}>Next</button>
              </>
            )}

            {showAdditionalModal1 && !showAdditionalModal2 && (
              <>
                <label>
                    <button type="button" onClick={updateLocation} disabled={loadingLocation}>
                        {loadingLocation ? "Fetching Location..." : "Use Current Location"}
                    </button>
                </label>
                {errors.location && <p className="error-message">{errors.location}</p>}


                <label>Radius</label>
                <div>
                    <Slider
                    aria-label="radius"
                    value={radius}
                    onChange={updateRadius}
                    // min={1}
                    // max={50}
                    // step={1}
                    />
                </div>

                <label>Do you have kids?</label>
                <div>
                  <label>
                    <input
                      type="radio"
                      name='kids'
                      value='true'
                      checked={kids === true}
                      onChange={updateKids}
                      required
                    /> Yes
                  </label>

                  <label>
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
                    {validationErrors.hasBackyard && <p className="signup-error-message">{validationErrors.hasBackyard}</p>}
                </div>

                <label>Do you have any other pets?</label>
                  <div>
                  <label>
                    <input
                      type="radio"
                      name='otherPets'
                      value='none'
                      checked={otherPets === 'none'}
                      onChange={updateOtherPets}
                      required
                    />None
                  </label>

                  <label>
                    <input
                      type="radio"
                      name='otherPets'
                      value='dogsOnly'
                      checked={otherPets === 'dogsOnly'}
                      onChange={updateOtherPets}
                      required
                    />Dogs Only
                  </label>

                  <label>
                    <input
                      type="radio"
                      name='otherPets'
                      value='catsOnly'
                      checked={otherPets === 'catsOnly'}
                      onChange={updateOtherPets}
                      required
                    />Cats Only
                  </label>

                  <label>
                    <input
                      type="radio"
                      name='otherPets'
                      value='both'
                      checked={otherPets === 'both'}
                      onChange={updateOtherPets}
                      required
                    />Both
                  </label>

                  <label>
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
                    {validationErrors.otherPets && <p className="signup-error-message">{validationErrors.otherPets}</p>}
                  </div>



                <label>What&apos;s your pet experience?</label>
                <div>
                  <label>
                    <input
                      type="radio"
                      name='petExperience'
                      value='firstTime'
                      checked={petExperience === "firstTime"}
                      onChange={updatePetExperience}
                      required
                    /> First Time
                  </label>

                  <label>
                    <input
                      type="radio"
                      name='petExperience'
                      value='previous'
                      checked={petExperience === "previous"}
                      onChange={updatePetExperience}
                      required
                    /> Previous
                  </label>

                  <label>
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
                      onChange={updateHouseTrained}
                      required
                    /> Yes
                  </label>

                  <label>
                    <input
                      type="radio"
                      name='houseTrained'
                      value='false'
                      checked={houseTrained === false}
                      onChange={updateHouseTrained}
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
                      onChange={updateSpecialNeeds}
                      required
                    /> Yes
                  </label>

                  <label>
                    <input
                      type="radio"
                      name='specialNeeds'
                      value='false'
                      checked={specialNeeds === false}
                      onChange={updateSpecialNeeds}
                      required
                    /> No
                  </label>
                </div>

                <label>What&apos;s your ideal age?</label>
                <div>
                  <label>
                    <input
                      type="radio"
                      name='idealAge'
                      value='noPreference'
                      checked={idealAge === "noPreference"}
                      onChange={updateIdealAge}
                      required
                    /> No Preference
                  </label>

                  <label>
                    <input
                      type="radio"
                      name='idealAge'
                      value='puppy'
                      checked={idealAge === "puppy"}
                      onChange={updateIdealAge}
                      required
                    /> Puppy
                  </label>

                  <label>
                    <input
                      type="radio"
                      name='idealAge'
                      value='young'
                      checked={idealAge === "young"}
                      onChange={updateIdealAge}
                      required
                    /> Young
                  </label>

                  <label>
                    <input
                      type="radio"
                      name='idealAge'
                      value='adult'
                      checked={idealAge === "adult"}
                      onChange={updateIdealAge}
                      required
                    /> Adult
                  </label>

                  <label>
                    <input
                      type="radio"
                      name='idealAge'
                      value='senior'
                      checked={idealAge === "senior"}
                      onChange={updateIdealAge}
                      required
                    /> Senior
                  </label>

                </div>

                <label>What&apos;s your ideal sex?</label>
                <div>
                  <label>
                    <input
                      type="radio"
                      name='idealSex'
                      value='noPreference'
                      checked={idealSex === "noPreference"}
                      onChange={updateIdealSex}
                      required
                    /> No Preference
                  </label>

                  <label>
                    <input
                      type="radio"
                      name='idealSex'
                      value='male'
                      checked={idealSex === "male"}
                      onChange={updateIdealSex}
                      required
                    /> Male
                  </label>

                  <label>
                    <input
                      type="radio"
                      name='idealSex'
                      value='female'
                      checked={idealSex === "female"}
                      onChange={updateIdealSex}
                      required
                    /> Female
                  </label>
                </div>

                <label>What&apos;s your ideal size?</label>
                <div>
                  <label>
                    <input
                      type="radio"
                      name='idealSize'
                      value='noPreference'
                      checked={idealSize === "noPreference"}
                      onChange={updateIdealSize}
                      required
                    /> No Preference
                  </label>

                  <label>
                    <input
                      type="radio"
                      name='idealSize'
                      value='small'
                      checked={idealSize === "small"}
                      onChange={updateIdealSize}
                      required
                    /> Small
                  </label>

                  <label>
                    <input
                      type="radio"
                      name='idealSize'
                      value='medium'
                      checked={idealSize === "medium"}
                      onChange={updateIdealSize}
                      required
                    /> Medium
                  </label>

                  <label>
                    <input
                      type="radio"
                      name='idealSize'
                      value='large'
                      checked={idealSize === "large"}
                      onChange={updateIdealSize}
                      required
                    /> Large
                  </label>

                  <label>
                    <input
                      type="radio"
                      name='idealSize'
                      value='xl'
                      checked={idealSize === "xl"}
                      onChange={updateIdealSize}
                      required
                    /> XLarge
                  </label>
                </div>

                <label>What&apos;s your ideal lifestyle?</label>
                <div>
                  <label>
                    <input
                      type="radio"
                      name='lifestyle'
                      value='noPreference'
                      checked={lifestyle === "noPreference"}
                      onChange={updateLifestyle}
                      required
                    /> No Preference
                  </label>

                  <label>
                    <input
                      type="radio"
                      name='lifestyle'
                      value='veryActive'
                      checked={lifestyle === "veryActive"}
                      onChange={updateLifestyle}
                      required
                    /> Very Active
                  </label>

                  <label>
                    <input
                      type="radio"
                      name='lifestyle'
                      value='active'
                      checked={lifestyle === "active"}
                      onChange={updateLifestyle}
                      required
                    /> Active
                  </label>

                  <label>
                    <input
                      type="radio"
                      name='lifestyle'
                      value='laidback'
                      checked={lifestyle === "laidback"}
                      onChange={updateLifestyle}
                      required
                    /> Laid-back
                  </label>

                  <label>
                    <input
                      type="radio"
                      name='lifestyle'
                      value='lapPet'
                      checked={lifestyle === "lapPet"}
                      onChange={updateLifestyle}
                      required
                    /> Lap Pet
                  </label>
                </div>

                <button type="button" onClick={() => {
                  setShowAdditionalModal2(false)
                  setShowAdditionalModal1(true)
                }}>Back</button>
                <button type="submit">Save Changes</button>
              </>

            )}

          </form>
        </div>
      );
}

export default UpdateUserForm
