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
		<div className="my-4 bg-white border rounded-md shadow-md">
			<div className="p-8">
				<h1 className="font-extrabold text-2xl capitalize">{post?.title}</h1>
				<span>
					Written by{" "}
					<strong>
						<Link href={`/${post?.username}`}>
							<a href="">@{post?.username}</a>
						</Link>{" "}
					</strong>
					on {createdAt.toISOString()}
				</span>
			</div>
			<div className="h-full rounded-br-sm rounded-bl-sm p-4 bg-gray-200 overflow-y-scroll">
				<ReactMarkDown>{post?.content as string}</ReactMarkDown>
			</div>
		</div>
	);
};

export default PostContent;
