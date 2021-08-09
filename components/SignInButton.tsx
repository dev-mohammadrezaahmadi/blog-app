import { googleAuthProvider, auth } from "../lib/firebase";

const SignInButton = () => {
	const signInWithGoogle = async () => {
		await auth.signInWithPopup(googleAuthProvider);
	};

	return (
		<button className="btn" onClick={signInWithGoogle}>
			<img
				src="/google.png"
				alt="google sign-in button"
				className="h-10 mr-3"
			/>{" "}
			Sign in with Google
		</button>
	);
};

export default SignInButton;
