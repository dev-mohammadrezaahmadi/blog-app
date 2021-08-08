import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";

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
			className="flex flex-col justify-center rounded-lg bg-white px-4 py-2 fixed shadow-2xl"
		>
			<ul className="list-none flex justify-between items-center">
				<li className="flex items-center">
					<Link href="/">
						<button className="bg-black text-white rounded-md p-2 uppercase text-2xl font-bold">
							DEV
						</button>
					</Link>
				</li>

				{/* user is signed-in and has username */}
				{username && (
					<div className="flex justify-evenly items-center">
						<li>
							<Link href="/admin">
								<button className="mx-2 bg-blue-700 text-white py-2 px-2 md:px-5 text-xs sm:text-sm md:text-lg font-bold rounded-md">
									Write Posts
								</button>
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
							<button className="bg-blue-700 px-2  md:px-5 text-xs sm:text-sm md:text-lg text-white py-2 font-bold rounded-md">
								Log in
							</button>
						</Link>
					</li>
				)}
			</ul>
		</nav>
	);
};

export default Navbar;

const SignOutButton = () => {
	const router = useRouter();
	return (
		<button
			style={{ width: "content" }}
			className="bg-red-400 hover:bg-red-500 text-white py-2 px-2  md:px-5 text-xs sm:text-sm md:text-lg font-bold rounded-md"
			onClick={() => {
				auth.signOut();
				router.push("/");
			}}
		>
			Sign Out
		</button>
	);
};
