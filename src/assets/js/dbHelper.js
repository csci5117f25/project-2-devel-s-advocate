// Script to contain helper functions for Firestore DB operations
import { collection, doc, query, where, orderBy, limit, getDoc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore'
import { useFirestore, useCollection, useDocument, useCurrentUser } from 'vuefire'
import { computed, ref, watch } from 'vue'
//Use this one for when you don't need reactive data
import { db as firebaseDb } from '@/firebaseApp'

//Use for reactive data
const db = useFirestore()

// ──────────────────────────────────────────────────────────────
// 1. return all user runs, ordered by start time desc, max 50
// ──────────────────────────────────────────────────────────────
export function useUserRuns(userId, max = 50) {
    if (!userId) return computed(() => [])

    const q = query(
        collection(db, 'runs'),
        where('userId', '==', userId),
        orderBy('startTime', 'desc'),
        limit(max)
    )

    return useCollection(q)
}

// ──────────────────────────────────────────────────────────────
// Get single run by ID of run document
// ──────────────────────────────────────────────────────────────
export function useRun(runId) {
    return useDocument(doc(db, 'runs', runId))
}

// ──────────────────────────────────────────────────────────────
// Check if user exists in database and create if not
// ──────────────────────────────────────────────────────────────
export async function checkAndCreateUser(user) {
    const userRef = doc(firebaseDb, "users", user.uid)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
        // Create user document
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: new Date().toISOString()
        })

        //Init the private stats
        const statsRef = doc(firebaseDb, "users", user.uid, "private", "stats")
        await setDoc(statsRef, {
            totalRuns: 0,
            totalMiles: 0,
            longestRun: 0,
            totalRunningTime: 0,
        })
    }
    return userDoc.data() 
    
}

// ──────────────────────────────────────────────────────────────
// Returns user data reactively
// ──────────────────────────────────────────────────────────────
export function getUserData() {
    const user = useCurrentUser()
    const userData = ref(null)

    watch(user, async (newUser) => {
        if (newUser?.uid) {
            const userRef = doc(firebaseDb, "users", newUser.uid)
            const userDoc = await getDoc(userRef)

            if (userDoc.exists()) {
                const statsRef = doc(firebaseDb, "users", newUser.uid, "private", "stats")
                const statsDoc = await getDoc(statsRef)
                
                userData.value = {
                    ...userDoc.data(), //... is the spread operator
                    stats: statsDoc.exists() ? statsDoc.data() : null
                }
            } else {
                userData.value = null
            }
        } else {
            userData.value = null
        }
    }, { immediate: true })

    return userData
}

// ──────────────────────────────────────────────────────────────
// Saves run data
// ──────────────────────────────────────────────────────────────
export async function saveRun(runData) {
  const docRef = await addDoc(collection(db, 'runs'), {
    ...runData,
    createdAt: serverTimestamp()
  })
  return docRef.id
}