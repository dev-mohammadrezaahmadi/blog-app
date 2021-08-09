import { useContext } from "react";
import { UserContext } from "../lib/context";
import { useRouter } from "next/router";
import SignOutButton from "../components/SignoutButton";
import SignInButton from "../components/SignInButton";
import UsernameForm from "../components/UsernameForm";

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
