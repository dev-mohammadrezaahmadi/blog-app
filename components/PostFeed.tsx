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
		<div className="">
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
			<footer>
				<span>
					{wordCount} words. {minutesToRead} min Read
				</span>
				<span>❤ {post?.likes} likes</span>
			</footer>
		</div>
	);
};
