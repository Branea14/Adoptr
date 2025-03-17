import { useParams } from "react-router-dom"
import "./ProfileModal.css"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { thunkGetUser } from "../../redux/session"

const ProfileModal = () => {
    const {userId} = useParams()
    const dispatch = useDispatch()

    const selectedUser = useSelector((state) => state.session.selectedUser)

    useEffect(() => {
        dispatch(thunkGetUser(userId))
    }, [dispatch, userId])


    if (!selectedUser) return <p>Loading...</p>

    console.log('LOOOk for erka', selectedUser)

    return (
        <div className="profile-page-container">
            <div className="profile-info-container">
                <div className="profile-image-section">
                    <img className='profile-image' src={selectedUser?.avatar} alt={`${selectedUser.firstName}'s profile picture`}/>
                </div>

                <div className="profile-info">
                    <h1>{selectedUser?.firstName} {selectedUser?.lastName}</h1>
                </div>

                <div className="profile-section">
                    <h3>Home & Lifestyle</h3>
                    <p>Has Backyard: <span className='profile-backyard'>{selectedUser?.hasBackyard ? "yes" : "no"}</span></p>
                    <p>Kids: <span className='profile-kids'>{selectedUser?.kids ? "yes" : "no"}</span></p>
                    <p>Other Pets: <span className='profile-otherPets'>{selectedUser?.otherPets ? "yes" : "no"}</span></p>
                </div>

                <div className="profile-section">
                    <h3>Adoption Preferences</h3>
                    {Object.values(selectedUser?.idealDogPreferences).length > 0 ? (
                        <>
                             <p>Preferred Size: {selectedUser?.idealDogPreferences?.size || "N/A"}</p>
                            <p>Preferred Age: {selectedUser?.idealDogPreferences?.age || "N/A"}</p>
                            <p>Preferred Sex: {selectedUser?.idealDogPreferences?.sex || "N/A"}</p>
                            <p>Lifestyle: {selectedUser?.idealDogPreferences?.lifestyle || "N/A"}</p>
                            <p>House Trained? {selectedUser?.idealDogPreferences?.houseTrained ? "yes" : "no"}</p>
                            <p>Special Needs? {selectedUser?.idealDogPreferences?.specialNeeds ? "yes" : "no"}</p>


                        </>
                    ) : (
                        <p>No adoption preferences set.</p>
                    )
                        }

                </div>

            </div>
        </div>

    )
}

export default ProfileModal
