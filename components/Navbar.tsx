import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

const Navbar = () => {
	const { user, username } = useContext(UserContext);
	return (
		<nav className="h-20 w-full bg-white text-black fixed bottom-0 font-bold z-50 shadow-md">
			<ul className="list-none m-0 p-0 flex items-center justify-evenly h-full">
				<li className="rounded-full">
					<Link href="/">
						<button className="btn bg-black text-white text-2xl">FEED</button>
					</Link>
				</li>

				{/* user is signed-in and has username */}
				{username && (
					<>
						<li>
							<Link href="/admin">
								<button className="btn bg-blue-700 text-white text-xl">
									Write Posts
								</button>
							</Link>
						</li>
						<li>
							<Link href={`/${username}`}>
								<img
									className="cursor-pointer border-black h-8 w-8 rounded-full"
									src={user?.photoURL}
									alt=""
								/>
							</Link>
						</li>
					</>
				)}

				{/* user is not signed or has not created username */}
				{!username && (
					<li>
						<Link href="/enter">
							<button className="btn text-xl bg-blue-700 text-white">
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
