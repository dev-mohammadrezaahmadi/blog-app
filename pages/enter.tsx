import { useState, useEffect, useCallback } from "react";
import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import debounce from "lodash.debounce";

const EnterPage = () => {
	const { user, username } = useContext(UserContext);
	return (
		<main className="mt-96">
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
			<img src="/google.png" alt="google sign-in button" /> Sign in with Google
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
	const [formValue, setFormValue] = useState("");
	const [isValid, setIsValid] = useState(false);
	const [loading, setLoading] = useState(false);

	const { user, username } = useContext(UserContext);

	useEffect(() => {
		checkUsername(formValue);
	}, [formValue]);

	const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();

		const userDoc = firestore.doc(`users/${user.uid}`);
		const usernameDoc = firestore.doc(`usernames/${formValue}`);

		const batch = firestore.batch();
		batch.set(userDoc, {
			username: formValue,
			photoURL: user?.photoURL,
			displayName: user?.displayName,
		});
		batch.set(usernameDoc, { uid: user?.uid });

		await batch.commit();
	};

	const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const val = e.target.value.toLowerCase();
		const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

		if (val.length < 3) {
			setFormValue(val);
			setLoading(false);
			setIsValid(false);
		}

		if (re.test(val)) {
			setFormValue(val);
			setLoading(true);
			setIsValid(false);
		}
	};

	const checkUsername = useCallback(
		debounce(async (username: string) => {
			if (username.length >= 3) {
				const ref = firestore.doc(`usernames/${username}`);
				const { exists } = await ref.get();
				setIsValid(!exists);
				setLoading(false);
			}
		}, 500),
		[]
	);

	const UsernameMessage = ({
		username,
		isValid,
		loading,
	}: {
		username: string;
		isValid: boolean;
		loading: boolean;
	}) => {
		if (loading) {
			return <p>Checking...</p>;
		} else if (isValid) {
			return <p>{username} is available</p>;
		} else if (username && !isValid) {
			return <p>That username is taken!</p>;
		} else {
			return <p></p>;
		}
	};

	if (!username) {
		return (
			<section>
				<h3>Choose Username</h3>
				<form onSubmit={onSubmit}>
					<input
						type="text"
						placeholder="username"
						value={formValue}
						onChange={onChange}
					/>

					<UsernameMessage
						username={formValue}
						isValid={isValid}
						loading={loading}
					/>
					<button
						type="submit"
						className="btn bg-green-600 text-white"
						disabled={!isValid}
					>
						Choose
					</button>

					<h3>Debug State</h3>
					<div>
						Username: {formValue}
						<br />
						Loading: {loading.toString()}
						<br />
						Username Valid: {isValid.toString()}
					</div>
				</form>
			</section>
		);
	} else {
		return null;
	}
};
