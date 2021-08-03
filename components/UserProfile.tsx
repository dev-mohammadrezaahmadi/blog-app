import { UserType } from "../lib/context";

interface UserProfileProps {
	user: UserType;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
	return (
		<div>
			<img src={user?.photoURL} />
			<p>
				<i>@{user?.username}</i>
			</p>
			<h1>{user?.displayName}</h1>
		</div>
	);
};

export default UserProfile;
