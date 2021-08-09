import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import SignOutButton from "./SignoutButton";

const Navbar = () => {
	const { user, username } = useContext(UserContext);
	return (
		<nav
			style={{
				width: "96vw",
				left: "50%",
				marginLeft: "-48vw",
				top: "1vh",
				height: "70px",
			}}
			className="flex flex-col justify-center rounded-lg bg-white px-4 py-2 fixed shadow-2xl z-50"
		>
			<ul className="list-none flex justify-between items-center">
				<li className="flex items-center">
					<Link href="/">
						<button className="btn text-2xl uppercase">DEV</button>
					</Link>
				</li>

				{/* user is signed-in and has username */}
				{username && (
					<div className="flex justify-evenly items-center">
						<li>
							<Link href="/admin">
								<button className="btn btn--blue">Write Posts</button>
							</Link>
						</li>
						<SignOutButton />
						<li>
							<Link href={`/${username}`}>
								<img
									className="h-10 w-10 rounded-full ml-1 md:mx-5 cursor-pointer"
									src={user?.photoURL}
									alt=""
								/>
							</Link>
						</li>
					</div>
				)}

				{/* user is not signed or has not created username */}
				{!username && (
					<li>
						<Link href="/enter">
							<button className="btn btn--blue">Log in</button>
						</Link>
					</li>
				)}
			</ul>
		</nav>
	);
};

export default Navbar;
