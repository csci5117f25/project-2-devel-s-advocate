import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from "@/firebaseApp"
import { checkAndCreateUser } from "./dbHelper"

export function useAuth() {
    const login = async () => {
        const result = await signInWithPopup(auth, googleProvider)
        
        await checkAndCreateUser(result.user)
        
        return result
    }

    const logout = () => signOut(auth)

    return {
        login,
        logout,
        onAuthStateChanged,
        auth
    }
}