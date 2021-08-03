import Link from "next/link";
import ReactMarkDown from "react-markdown";
import { PostType } from "../lib/context";

interface PostContentProps {
	post?: PostType;
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
	const createdAt =
		typeof post?.createdAt === "number"
			? new Date(post.createdAt)
			: post?.createdAt.toDate();

	return (
		<div>
			<h1>{post?.title}</h1>
			<span>
				Written by
				<Link href={`/${post?.username}`}>
					<a href="">@{post?.username}</a>
				</Link>
				on {createdAt.toISOString()}
			</span>
			<ReactMarkDown>{post?.content as string}</ReactMarkDown>
		</div>
	);
};

export default PostContent;
