import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

const Navbar = () => {
	const { user, username } = useContext(UserContext);
	return (
		<nav
			style={{ width: "95vw" }}
			className="shadow-lg rounded-lg bg-white px-4 py-2 mx-auto mt-2"
		>
			<ul className="list-none flex justify-between">
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
								<button className="bg-blue-700 text-white py-2 px-5 text-lg font-bold rounded-md">
									Write Posts
								</button>
							</Link>
						</li>
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
							<button className="bg-blue-700 text-white py-2 px-5 text-lg font-bold rounded-md">
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
