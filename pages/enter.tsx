import { auth, googleAuthProvider } from "../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../lib/context";

const EnterPage = () => {
	const { user, username } = useContext(UserContext);
	return (
		<main>
			{user ? (
				!username ? (
					<UsernameForm />
				) : (
					<SignOutButton />
				)
			) : (
				<SignInButton />
			)}
		</main>
	);
};

export default EnterPage;

const SignInButton = () => {
	const signInWithGoogle = async () => {
		await auth.signInWithPopup(googleAuthProvider);
	};

	return (
		<button
			className="btn text-black text-xl bg-gray-400"
			onClick={signInWithGoogle}
		>
			<img src="/google.png" alt="google sign in button" /> Sign in with Google
		</button>
	);
};

const SignOutButton = () => {
	return (
		<button className="btn" onClick={() => auth.signOut()}>
			Sign Out
		</button>
	);
};

const UsernameForm = () => {
	return <div></div>;
};
