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
		<div className="relative p-8 my-4 bg-white border rounded-md shadow-md w-4/5 mx-auto">
			<Link href={`/${post?.username}/${post?.slug}`}>
				<h2 className="font-extrabold text-2xl capitalize cursor-pointer">
					<a href="">{post?.title}</a>
				</h2>
			</Link>

			<Link href={`/${post?.username}`}>
				<a href="">
					<strong className="cursor-pointer">By @{post?.username}</strong>
				</a>
			</Link>

			<footer className="flex justify-between mt-5">
				<span className="">
					{wordCount} words. {minutesToRead} min read
				</span>
				<span>{post?.likes} 💜</span>
			</footer>

			{/* If admin view, show extra controls for user */}
			{admin && (
				<div className="flex justify-between mt-5">
					<Link href={`/admin/${post?.slug}`}>
						<h3>
							<button className="btn btn--blue">Edit</button>
						</h3>
					</Link>

					{post?.published ? (
						<p className="absolute bottom-0 right-0 rounded-br-md rounded-tl-md bg-green-500 text-white text-lg md:text-xl font-bold py-2 px-4 ">
							Live
						</p>
					) : (
						<p className="absolute bottom-0 right-0 rounded-br-md rounded-tl-md bg-red-600 text-white text-lg md:text-xl font-bold py-2 px-4 ">
							Unpublished
						</p>
					)}
				</div>
			)}
		</div>
	);
};
