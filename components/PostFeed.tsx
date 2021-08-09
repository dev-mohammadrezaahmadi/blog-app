import { PostType } from "../lib/context";
import PostItem from "./PostItem";

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
