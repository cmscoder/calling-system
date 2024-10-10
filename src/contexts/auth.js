import { useState, createContext, useEffect } from "react";
import { auth, db } from '../services/firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from 'firebase/firestore'

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export const AuthContext = createContext({});

function AuthProvider({children}){
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser(){
      const storageUser = localStorage.getItem('@ticketsPRO')

      if(storageUser){
        setUser(JSON.parse(storageUser))
        setLoading(false);
      }

      setLoading(false);
    }

    loadUser();
  }, [])

  async function signIn(email, password){
    setLoadingAuth(true);

    await signInWithEmailAndPassword(auth, email, password)
    .then(async (value) => {
      let uid = value.user.uid;

      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef)

      let data = {
        uid: uid,
        userName: docSnap.data().name,
        userEmail: value.user.email,
        avatarUrl: docSnap.data().avatarUrl
      };

      setUser(data);
      storageUser(data);
      setLoadingAuth(false);
      toast.success("Welcome back!!")
      navigate("/dashboard")
    })
    .catch((error) => {
      console.log("ERROR --->", error);
      setLoadingAuth(false);
      toast.error("Ups something goes wrong!");
    })
  }

  async function signUp(email, password, name){
    setLoadingAuth(true);

    await createUserWithEmailAndPassword(auth, email, password)
    .then(async (value) => {
      let uid = value.user.uid
      
      await setDoc(doc(db, "users", uid), {
        name: name,
        avatarUrl: null
      })
      .then(() => {
        let data = {
          uid: uid,
          userName: name,
          userEmail: value.user.email,
          avatarUrl: null
        };

        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
        toast.success("Welcome to the system!")
        navigate("/dashboard")
      })
    })
    .catch((error) => {
      console.log("ERROR -->", error);
      setLoadingAuth(false);
    })
  }

  function storageUser(data){
    localStorage.setItem('@ticketsPRO', JSON.stringify(data))
  }

  async function logout(){
    await signOut(auth);
    localStorage.removeItem('@ticketsPRO');
    setUser(null);
  }



  return(
    <AuthContext.Provider 
      value={{
        signed: !!user,
        user,
        signIn,
        signUp,
        logout,
        loadingAuth,
        loading,
        storageUser,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;