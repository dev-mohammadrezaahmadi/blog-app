import { createContext } from "react";

export interface UserContextType {
	user: any;
	username: any;
}

export const UserContext = createContext<UserContextType>({
	user: null,
	username: null,
});
