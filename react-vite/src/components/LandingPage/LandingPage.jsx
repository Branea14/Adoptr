import { useEffect, useState } from "react";
import { useDrag } from "@use-gesture/react";
import "./LandingPage.css";

const LandingPage = () => {
    const [loading, setLoading] = useState(true);
    const [swiped, setSwiped] = useState(false);
    const [position, setPosition] = useState(0);
    const [showButtons, setShowButtons] = useState(false);

    // movement is how far user moved div, [x] horiztontally on x-axis
    // down touching/moving the el
    //direction 1 right, -1 left
    //velocity[0] speed

    const bind = useDrag(({ movement: [x], down, direction: [xDir], velocity }) => {
        const requiredDistance = 25;
        const minVelocity = 0.2;

        if (!down && x > requiredDistance && velocity[0] > minVelocity && xDir > 0) setSwiped(true)
        setPosition(down ? x : swiped ? 500 : 0);
    });

    useEffect(() => {
        if (swiped) setTimeout(() => setShowButtons(true), 300);
    }, [swiped]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, []);

    return (
        <div className={`container ${loading ? "loading" : "loaded"}`}>
            {loading ? (
                <div className="loading-screen">
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
                                <button>Login</button>
                                <button>Sign Up</button>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default LandingPage;
