import React, {useEffect, useState} from "react";
import firebase from '../firebase';
import LoadingCircles from "../lib/components/LoadingCircles";


export const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false);
        })
    }, []);

    if(loading) {
        return <LoadingCircles></LoadingCircles>
    }
    return (
        <AuthContext.Provider
            value={{currentUser,}}>
                {children}
        </AuthContext.Provider>
    )
}