import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
	apiKey: `${process.env.NEXT_PUBLIC_API_KEY}`,
	authDomain: `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}`,
	projectId: `${process.env.NEXT_PUBLIC_PROJECT_ID}`,
	storageBucket: `${process.env.NEXT_PUBLIC_STORAGE_BUCKET}`,
	messagingSenderId: `${process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID}`,
	appId: `${process.env.NEXT_PUBLIC_APP_ID}`,
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();

// Helper functions

// Get a user form database based on username prop
export async function getUserWithUsername(username: string) {
	const usersRef = firestore.collection("users");
	const query = usersRef.where("username", "==", username).limit(1);
	const userDoc = (await query.get()).docs[0];
	return userDoc;
}

// Converts a firestore doc to JSON
export function postToJSON(doc: firebase.firestore.DocumentData) {
	const data = doc.data();
	return {
		...data,
		// firestore timestamp NOT serializable to JSON
		createdAt: data.createdAt.toMillis(),
		updatedAt: data.updatedAt.toMillis(),
	};
}
