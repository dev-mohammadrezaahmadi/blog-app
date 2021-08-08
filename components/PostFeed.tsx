import Link from "next/link";
import { PostType } from "../lib/context";

interface PostFeedProps {
	posts?: PostType[];
	admin?: boolean;
}

const PostFeed: React.FC<PostFeedProps> = ({ admin, posts }) => {
	return posts ? (
		<>
			{posts.map((post) => (
				<PostItem post={post} key={post.slug} admin={admin} />
			))}
		</>
	) : null;
};

export default PostFeed;

interface PostItemProps {
	post?: PostType;
	admin?: boolean;
}
const PostItem: React.FC<PostItemProps> = ({ post, admin = false }) => {
	const wordCount = post?.content.trim().split(/\s+/g).length;

	const minutesToRead = ((wordCount as number) / 100 + 1).toFixed(0);

	return (
		<div className="p-8 my-4 bg-white border rounded-md shadow-md w-4/5 mx-auto">
			<Link href={`/${post?.username}`}>
				<a href="">
					<strong>By @{post?.username}</strong>
				</a>
			</Link>

			<Link href={`/${post?.username}/${post?.slug}`}>
				<h2>
					<a href="">{post?.title}</a>
				</h2>
			</Link>
			<footer className="flex justify-between">
				<span className="push-left">
					{wordCount} words. {minutesToRead} min read
				</span>
				<span>{post?.likes} ❤</span>
			</footer>

			{/* If admin view, show extra controls for user */}
			{admin && (
				<div className="flex justify-between mt-5">
					<Link href={`/admin/${post?.slug}`}>
						<h3>
							<button className=" text-lg bg-blue-600 text-white md:text-xl font-bold py-2 px-2 md:px-4 rounded-md">
								Edit
							</button>
						</h3>
					</Link>

					{post?.published ? (
						<p className="mx-2 text-green-500  text-lg md:text-xl font-bold py-2 px-4 rounded-md">
							Live
						</p>
					) : (
						<p className="mx-2 text-red-700 text-lg md:text-xl font-bold py-2 px-4 rounded-md">
							Unpublished
						</p>
					)}
				</div>
			)}
		</div>
	);
};
