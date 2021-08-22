import Head from "next/head";
import { useState } from "react";
import { GetServerSideProps } from "next";
import Loader from "../components/Loader";
import { firestore, postToJSON, fromMillis } from "../lib/firebase";
import { PostType } from "../lib/context";
import PostFeed from "../components/PostFeed";

interface HomePageProps {
	posts: PostType[];
}

const HomePage: React.FC<HomePageProps> = (props) => {
	const [posts, setPosts] = useState(props.posts);
	const [loading, setLoading] = useState(false);
	const [postsEnd, setPostsEnd] = useState(false);

	const getMorePosts = async () => {
		setLoading(true);
		const last = posts[posts.length - 1];

		const cursor =
			typeof last.createdAt === "number"
				? fromMillis(last.createdAt)
				: last.createdAt;

		const query = firestore
			.collectionGroup("posts")
			.where("published", "==", true)
			.orderBy("createdAt", "desc")
			.startAfter(cursor)
			.limit(LIMIT);

		const newPosts = (await query.get()).docs.map((doc) => doc.data());

		setPosts([...posts, ...(newPosts as PostType[])]);
		setLoading(false);

		if (newPosts.length < LIMIT) {
			setPostsEnd(true);
		}
	};

	return (
		<>
			<Head>
				<title>Blog App</title>
				<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
				<meta
					name="description"
					content="Read, Create and share content in simple way"
				/>
			</Head>
			<main className="flex flex-col items-center">
				<PostFeed posts={posts} />
				{posts.length > 0 ? (
					!loading &&
					!postsEnd && (
						<button onClick={getMorePosts} className="btn--outline">
							Load more
						</button>
					)
				) : (
					<p>There is no posts yet</p>
				)}

				<Loader show={loading} />
				{postsEnd && "You have reached the end!"}
			</main>
		</>
	);
};

export default HomePage;

// Max post to query per page
const LIMIT = 1;
export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const postsQuery = firestore
		.collectionGroup("posts")
		.where("published", "==", true)
		.orderBy("createdAt", "desc")
		.limit(LIMIT);

	const posts = (await postsQuery.get()).docs.map(postToJSON);

	return {
		props: {
			posts,
		},
	};
};
