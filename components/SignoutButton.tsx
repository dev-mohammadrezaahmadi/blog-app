import { useRouter } from "next/router";
import { auth } from "../lib/firebase";

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

export default SignOutButton;
