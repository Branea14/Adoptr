import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkAuthenticate } from "../../redux/session"
import UpdateUserForm from "./UpdateUserForm"


const UpdateUser = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)

    const currentUser = useSelector((state) => state.session.user)

    useEffect(() => {
        if (!currentUser) {
            dispatch(thunkAuthenticate())
                .then(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [dispatch, currentUser])

    if (loading || !currentUser) return

    return (
        <>
            <UpdateUserForm user={currentUser} />
        </>
    )
}

export default UpdateUser
