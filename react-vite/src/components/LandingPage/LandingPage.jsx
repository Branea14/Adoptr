import { useEffect, useState } from "react";
import { useDrag } from "@use-gesture/react";
import "./LandingPage.css";
import LoginFormModal from "../LoginFormModal";
import { useModal } from "../../context/Modal";
import SignupFormModal from "../SignupFormModal";

const LandingPage = () => {
    const [loading, setLoading] = useState(true);
    const [swiped, setSwiped] = useState(false);
    const [position, setPosition] = useState(0);
    const [showButtons, setShowButtons] = useState(false);
    const {setModalContent} = useModal();

    // movement is how far user moved div, [x] horiztontally on x-axis
    // down touching/moving the el
    //direction 1 right, -1 left
    //velocity[0] speed

    const bind = useDrag(({ movement: [x], down, direction: [xDir], velocity }) => {
        const requiredDistance = 40;
        const minVelocity = 0.15;
        const edgeThreshold = window.innerWidth * .75

        const shouldSwipe = xDir > 0 && (x > requiredDistance || velocity[0] > minVelocity)

        // case 1: normal swipe release
        if (!down && shouldSwipe) {
            setSwiped(window.innerWidth)
        // case 2: drag to edge but no release - treat as swipe
        } else if (down && x >= edgeThreshold) {
            setSwiped(window.innerWidth)
        } else {
            setPosition(down ? x : 0)
        }

    });

    useEffect(() => {
        if (swiped) setTimeout(() => setShowButtons(true), 300);
    }, [swiped]);

    // useEffect(() => {
    //     setTimeout(() => {
    //         setLoading(false);
    //     }, 1500);
    // }, []);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }, []);

    const handleLoginButton = async (e) => {
        e.preventDefault()
        setModalContent(<LoginFormModal/>)
    }

    const handleSignUpButton = async (e) => {
        e.preventDefault()
        setModalContent(<SignupFormModal/>)
    }

    return (
        <div className={`container ${loading ? "loading" : "loaded"}`}>
            {loading ? (
                <div className="loading-screen">
                    <img src="/logo.png" alt="Adoptr Logo" className='landing-page-nav-logo'/>
                    <h1 className="brand">Adoptr</h1>
                </div>
            ) : (
                <div className="landing-page-container">
                    <img
                        src="https://www.queensu.ca/gazette/sites/gazettewww/files/assets/WEB%20PETS%20eric-ward-610868-unsplash.jpg"
                        alt="Pets"
                        className="fullscreen-image"
                    />

                    {!swiped ? (
                        <div {...bind()} className="slogan-overlay">
                            <h1
                                className="slogan"
                                style={{transform: `translateX(${position}px)`}}
                            >
                                SWIPE RIGHT FOR <span>YOUR NEW BEST FRIEND</span>
                            </h1>
                        </div>
                    ) : showButtons ? (
                        <div className="buttons-overlay">
                            <div className="buttons">
                                <button onClick={handleLoginButton}>Login</button>
                                <button onClick={handleSignUpButton}>Sign Up</button>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default LandingPage;
