import { GetStaticPaths, GetStaticProps } from "next";
import { getUserWithUsername, postToJSON, firestore } from "../../lib/firebase";
import { ParsedUrlQuery } from "querystring";

const PostPage = () => {
	return <div></div>;
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
