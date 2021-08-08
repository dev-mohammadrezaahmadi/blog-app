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
		<div className="p-8 my-4 bg-white border rounded-md shadow-md w-4/5 mx-auto">
			<h1 className="font-bold text-lg">{post?.title}</h1>
			<span>
				Written by
				<Link href={`/${post?.username}`}>
					<a href="">@{post?.username}</a>
				</Link>
				on {createdAt.toISOString()}
			</span>
			<div className="h-full rounded-br-sm rounded-bl-sm p-4 bg-gray-200	">
				<ReactMarkDown>{post?.content as string}</ReactMarkDown>
			</div>
		</div>
	);
};

export default PostContent;
