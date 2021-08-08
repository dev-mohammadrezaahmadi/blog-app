import { UserType } from "../lib/context";

interface UserProfileProps {
	user: UserType;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
	return (
		<div className="bg-white p-4 shadow-lg rounded-md flex flex-col items-center">
			<img className="rounded-full" src={user?.photoURL} />
			<p>
				<i>@{user?.username}</i>
			</p>
			<h1 className="font-bold text-xl">{user?.displayName}</h1>
		</div>
	);
};

export default UserProfile;
