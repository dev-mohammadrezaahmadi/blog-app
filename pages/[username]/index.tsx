import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import { GetServerSideProps } from "next";

import { PostType, UserType } from "../../lib/context";
import { getUserWithUsername, postToJSON } from "../../lib/firebase";

interface UserProfilePageProps {
	user: UserType;
	posts: PostType[];
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, posts }) => {
	return (
		<main>
			<UserProfile user={user} />
			<PostFeed posts={posts} admin={false} />
		</main>
	);
};

export default UserProfilePage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const { username } = query;
	const userDoc = await getUserWithUsername(username as string);

	// JSON serializable data
	let user = null;
	let posts = null;

	if (userDoc) {
		user = userDoc.data();
		const postsQuery = userDoc.ref
			.collection("posts")
			.where("published", "==", true)
			.orderBy("createdAt", "desc")
			.limit(5);

		posts = (await postsQuery.get()).docs.map(postToJSON);
	} else {
		return {
			notFound: true,
		};
	}

	return {
		props: { user, posts },
	};
};
