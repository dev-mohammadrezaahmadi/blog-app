import { createContext } from "react";
import firebase from "firebase";

export interface UserType extends firebase.User {
	displayName: string;
	photoURL: string;
	username: string;
}

export interface PostType {
	content: string;
	likes: number;
	published: boolean;
	title: string;
	uid: string;
	createdAt: any;
	updatedAt: any;
	username: string;
	slug: string;
}

export interface UsernameType {
	uid: string;
}
export interface UserContextType {
	user?: UserType | null;
	username?: string | null;
}

export const UserContext = createContext<UserContextType>({
	user: null,
	username: null,
});
