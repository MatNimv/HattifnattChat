import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../firebase";
function Reset() {
    const [email, setEmail] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const history = useHistory();
    useEffect(() => {
        if (loading) return;
        if (user) history("/");
    }, [user, loading]);
    return (
        <div className="reset">
            <div className="reset__container">
                <input
                    type="text"
                    className="reset__textBox"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail Address"
                />
                <button
                    className="reset__btn"
                    onClick={() => sendPasswordReset(email)}
                >
                    Send password reset email
                </button>
                <div>
                    Don't have an account? <Link to="/register">Register</Link> now.
                </div>
            </div>
        </div>
    );
}
export default Reset;
