import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";

const handleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("User details:", user);
    return user
  } catch (error: any) {
    console.error("Error during sign-in:", error.message);
    return null
  }
};

const handleLogout = async () => {
  try 
  {
    await auth.signOut();
    localStorage.removeItem("user");
    return true;
  }
  catch(err)
  {
    console.error(err);
    return null;
  }
};

export {handleLogin, handleLogout}
