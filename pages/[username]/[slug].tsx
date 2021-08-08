import { GetStaticPaths, GetStaticProps } from "next";
import { getUserWithUsername, postToJSON, firestore } from "../../lib/firebase";
import { ParsedUrlQuery } from "querystring";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { PostType } from "../../lib/context";
import PostContent from "../../components/PostContent";
import AuthCheck from "../../components/AuthCheck";
import LikeButton from "../../components/LikeButton";
import Link from "next/link";

interface PostPageProps {
	path: string;
	post: PostType;
}

const PostPage: React.FC<PostPageProps> = (props) => {
	const postRef = firestore.doc(props.path);
	const [realtimePost] = useDocumentData(postRef);

	const post = realtimePost || props.post;

	return (
		<main>
			<div className="flex w-full flex-col md:flex-row md:w-4/5 mx-auto">
				<section className="w-full order-2 md:order-1 md:w-5/6">
					<PostContent post={post as PostType} />
				</section>

				<aside
					style={{ height: "content" }}
					className="w-full order-1 md:order-2 md:w-2/6 flex flex-col items-center p-4 bg-white rounded-md shadow-md "
				>
					<p className="mb-2 w-24 border border-purple-600 py-2 px-4 rounded-md flex justify-center">
						<strong>{post.likes || 0} 💜 </strong>
					</p>
					<AuthCheck
						fallback={
							<Link href={"/enter"}>
								<button className="">💙 Sign Up</button>
							</Link>
						}
					>
						<LikeButton postRef={postRef} />
					</AuthCheck>
				</aside>
			</div>
		</main>
	);
};

export default PostPage;

interface IParams extends ParsedUrlQuery {
	slug: string;
	username: string;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { username, slug } = params as IParams;
	const userDoc = await getUserWithUsername(username);

	let post;
	let path;

	if (userDoc) {
		const postRef = userDoc.ref.collection("posts").doc(slug);
		post = postToJSON(await postRef.get());

		path = postRef.path;
	}

	return {
		props: {
			path,
			post,
		},
		revalidate: 5000,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const snapshot = await firestore.collectionGroup("posts").get();

	const paths = snapshot.docs.map((doc) => {
		const { slug, username } = doc.data();
		return {
			params: { username, slug },
		};
	});

	return {
		paths,
		fallback: "blocking",
	};
};
