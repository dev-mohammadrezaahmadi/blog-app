import { useState, useEffect, useCallback } from "react";
import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";

const EnterPage = () => {
	const { user, username } = useContext(UserContext);
	const router = useRouter();

	if (user && username) router.push("/");
	return (
		<main style={{ height: "100vh" }} className=" flex items-center">
			<div className="flex justify-center items-center w-1/2 mx-auto rounded-md relative h-2/5">
				{user ? (
					!username ? (
						<UsernameForm />
					) : (
						<SignOutButton />
					)
				) : (
					<SignInButton />
				)}
			</div>
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
			className="px-2 md:px-5 text-xs sm:text-sm md:text-lg flex items-center font-semibold bg-black text-white rounded-md py-2"
			onClick={signInWithGoogle}
		>
			<img
				src="/google.png"
				alt="google sign-in button"
				className="h-10 mr-3"
			/>{" "}
			Sign in with Google
		</button>
	);
};

const SignOutButton = () => {
	const router = useRouter();
	return (
		<button
			className="bg-red-400 px-2 md:px-5 text-xs sm:text-sm md:text-lg text-white py-2 font-bold rounded-md"
			onClick={() => {
				auth.signOut();
				router.push("/");
			}}
		>
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

		const userDoc = firestore.doc(`users/${user?.uid}`);
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
			return <p className="mt-10">Checking...</p>;
		} else if (isValid) {
			return <p className="mt-10">{username} is available</p>;
		} else if (username && !isValid) {
			return <p className="mt-10">That username is invalid</p>;
		} else {
			return <p className="mt-10">Pleaser enter a username</p>;
		}
	};

	if (!username) {
		return (
			<section className="flex flex-col relative w-full h-full items-center pt-10">
				<h3 className="mb-2">Choose Username:</h3>
				<form className="flex justify-center h-10 w-full" onSubmit={onSubmit}>
					<input
						type="text"
						placeholder="username"
						value={formValue}
						onChange={onChange}
						className="border px-4 w-4/6 rounded-md text-black"
					/>

					<button
						type="submit"
						className="absolute w-full bottom-0 text-white bg-green-600 font-bold rounded-bl-md rounded-br-md p-3 text-lg"
						disabled={!isValid}
					>
						Choose
					</button>
					{/* This line is for developer checking */}
					{/* <h3>Debug State</h3>
					<div>
						Username: {formValue}
						<br />
						Loading: {loading.toString()}
						<br />
						Username Valid: {isValid.toString()}
					</div> */}
				</form>
				<UsernameMessage
					username={formValue}
					isValid={isValid}
					loading={loading}
				/>
			</section>
		);
	} else {
		return null;
	}
};
