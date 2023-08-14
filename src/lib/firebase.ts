import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {
	getAuth,
	signInWithPopup,
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
	measurementId: "G-D4KHZM016L",
};

const app = initializeApp(firebaseConfig);

// export const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);

export async function signInWithGoogle() {
	const credential = signInWithPopup(auth, new GoogleAuthProvider());
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
