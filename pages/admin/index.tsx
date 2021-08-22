import Head from "next/head";
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
		<>
			<Head>
				<title>Administrator</title>
			</Head>
			<main>
				<AuthCheck>
					<CreateNewPost />
					<PostList />
				</AuthCheck>
			</main>
		</>
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
			<h1 className="font-bold text-3xl w-full flex justify-center">
				Manage Your Posts
			</h1>
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
		<>
			<form
				className="w-4/5 mx-auto flex flex-col sm:flex-row justify-between mb-10"
				onSubmit={createPost}
			>
				<div className="w-full mb-2 sm:mb-0 sm:w-4/6">
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="type your article title"
						className="w-full rounded-md text-black p-4"
					/>
				</div>
				<button className="btn" type="submit" disabled={!isValid}>
					Create New Post
				</button>
			</form>
			{/* __dev__ */}
			{/* <p>
				<strong className="uppercase ">Slug:</strong> {slug}
			</p> */}
		</>
	);
};
