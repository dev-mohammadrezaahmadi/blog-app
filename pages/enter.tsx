import { useState, useEffect, useCallback } from "react";
import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const EnterPage = () => {
	const { user, username } = useContext(UserContext);
	const router = useRouter();

	if (user && username) router.push("/");
	return (
		<main className=" flex items-center">
			<div className="flex justify-center items-center sm:w-1/2 lg:w-1/4 mx-auto rounded-md relative h-2/5">
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

const SignOutButton = () => {
	const router = useRouter();
	return (
		<button
			className="btn btn--red"
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
		toast.success("Username created successfuly :)");
	};

	const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const val = e.target.value.toLowerCase();
		const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

		if (val.length < 4) {
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
			if (username.length >= 4) {
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
			return <p className="mt-10 border p-4 rounded-md">Checking...</p>;
		} else if (isValid) {
			return (
				<p className="mt-10 border border-green-600 p-4 rounded-md">
					{username} is available
				</p>
			);
		} else if (username && !isValid) {
			return (
				<p className="mt-10 border border-red-600 p-4 rounded-md">
					That username is invalid
				</p>
			);
		} else {
			return (
				<p className="mt-10 border border-yellow-600 p-4 rounded-md">
					Pleaser enter a username
				</p>
			);
		}
	};

	if (!username) {
		return (
			<section className="flex flex-col relative w-full h-full items-center p-10 bg-white rounded-md">
				<h3 className="mb-2">Choose Username:</h3>
				<form className="flex justify-center h-10 w-full" onSubmit={onSubmit}>
					<input
						type="text"
						placeholder="username"
						value={formValue}
						onChange={onChange}
						className="border px-4 w-full rounded-md text-black"
					/>

					<button
						type="submit"
						className="absolute rounded-tl-none rounded-tr-none w-full bottom-0 btn btn--green"
						disabled={!isValid}
					>
						Choose
					</button>
					{/* __dev__ */}
					{/* <h3>Debug State</h3>
					<div>
						Username: {formValue}
						<br />
						Loading: {loading.toString()}
						<br />
						Username Valid: {isValid.toString()}
					</div> */}
				</form>
				<div className="py-4 my-4">
					<UsernameMessage
						username={formValue}
						isValid={isValid}
						loading={loading}
					/>
				</div>
			</section>
		);
	} else {
		return null;
	}
};
