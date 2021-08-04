import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

interface AuthCheckProps {
	fallback: React.FunctionComponentElement<null>;
}

// Component's children only shown to logged-in users
const AuthCheck: React.FC<AuthCheckProps> = (props) => {
	const { username } = useContext(UserContext);

	return username ? (
		<>{props.children}</>
	) : (
		props.fallback || <Link href="/enter">You must signed in</Link>
	);
};

export default AuthCheck;
