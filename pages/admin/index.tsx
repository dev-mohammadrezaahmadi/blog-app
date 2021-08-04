import { useContext, useState } from "react";
import { useRouter } from "next/dist/client/router";
import { useCollection } from "react-firebase-hooks/firestore";
import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import { PostType, UserContext, UsernameType } from "../../lib/context";
import { auth, firestore, serverTimeStamp } from "../../lib/firebase";
import kebabcase from "lodash.kebabcase";

const AdminPostsPage = () => {
	return (
		<main>
			<AuthCheck>
				<PostList />
				<CreateNewPost />
			</AuthCheck>
		</main>
	);
};

export default AdminPostsPage;

const PostList = () => {
	const ref = firestore
		.collection("users")
		.doc(auth.currentUser?.uid)
		.collection("posts");
	const query = ref.orderBy("createdAt", "desc");
	const [querySnapshot] = useCollection(query);

	const posts = querySnapshot?.docs.map((doc) => doc.data());

	return (
		<>
			<h1>Manage Your Posts</h1>
			<PostFeed posts={posts as PostType[]} admin={true} />
		</>
	);
};

const CreateNewPost = () => {
	const router = useRouter();
	const { username } = useContext(UserContext);
	const [title, setTitle] = useState("");

	// Ensure slugh is URL safe
	const slug = encodeURI(kebabcase(title));

	// Validata length
	const isValid = title.length > 3 && title.length < 100;

	// Create a new post in firestore
	const createPost: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		const uid = auth.currentUser?.uid;
		const ref = firestore
			.collection("users")
			.doc(uid)
			.collection("posts")
			.doc(slug);

		const data: PostType = {
			title,
			slug,
			uid: uid as string,
			username: username as string,
			published: false,
			content: "# New Post",
			createdAt: serverTimeStamp(),
			updatedAt: serverTimeStamp(),
			likes: 0,
		};

		await ref.set(data);

		// Imperative navigation after doc is set
		router.push(`/admin/${slug}`);
	};

	return (
		<form onSubmit={createPost}>
			<input
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="type your article title"
			/>
			<p>
				<strong>Slug:</strong> {slug}
			</p>
			<button type="submit" disabled={!isValid}>
				Create New Post
			</button>
		</form>
	);
};
