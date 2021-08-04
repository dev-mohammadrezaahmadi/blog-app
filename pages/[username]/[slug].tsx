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
			<section>
				<PostContent post={post as PostType} />
			</section>

			<aside>
				<p>
					<strong>{post.likes || 0} ❤ </strong>
				</p>
				<AuthCheck
					fallback={
						<Link href={"/enter"}>
							<button>💙 Sign Up</button>
						</Link>
					}
				>
					<LikeButton postRef={postRef} />
				</AuthCheck>
			</aside>
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
