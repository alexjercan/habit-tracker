import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, getDoc, addDoc, collection, setDoc } from "firebase/firestore";
import {
	getAuth,
	onAuthStateChanged,
	signInWithPopup,
	signInAnonymously,
	GoogleAuthProvider,
	type UserCredential,
	signOut
} from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyBRsHYT6FVBwG_CZFqvHGgkdRE3jkM9mhM",
	authDomain: "habittacker.firebaseapp.com",
	projectId: "habittacker",
	storageBucket: "habittacker.appspot.com",
	messagingSenderId: "584678627298",
	appId: "1:584678627298:web:859b4ce0c707a6075b8bbb",
	measurementId: "G-D4KHZM016L"
};

const app = initializeApp(firebaseConfig);

export const analytics = app.name && typeof window !== "undefined" ? getAnalytics(app) : null;
export const firestore = getFirestore(app);
export const auth = getAuth(app);

const defaultTasks = ["🧼 Bathroom", "📕 Read", "💪 Gym", "🧘 Meditate"];

onAuthStateChanged(auth, async (user) => {
	if (user) {
		const userDoc = await getDoc(doc(firestore, "tracker", user.uid));
		if (!userDoc.exists()) {
			setDoc(doc(firestore, "tracker", user.uid), {});

			for (const task of defaultTasks) {
				addDoc(collection(firestore, "tracker", user.uid, "habits"), {
					name: task,
					createdAt: new Date()
				});
			}
		}
	}
});

export async function signInWithGoogle() {
	const credential = signInWithPopup(auth, new GoogleAuthProvider());
	return loginHandler(credential);
}

export async function signInAsGuest() {
	const credential = signInAnonymously(auth);
	return loginHandler(credential);
}

async function loginHandler(promise: Promise<UserCredential>) {
	let res: any;
	try {
		res = await promise;
	} catch (err) {
		console.error(err);
	}
	return { res };
}

export async function firebaseSignOut() {
	await signOut(auth);
}
