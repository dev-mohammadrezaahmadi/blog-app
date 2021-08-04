import { useDocument } from "react-firebase-hooks/firestore";
import { auth, firestore, increment } from "../lib/firebase";

interface LikeButtonProps {
	postRef: any;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postRef }) => {
	const likesRef = postRef.collection("likes").doc(auth.currentUser?.uid);
	const [likesDoc] = useDocument(likesRef);

	const addLike = async () => {
		const uid = auth.currentUser?.uid;
		const batch = firestore.batch();

		batch.update(postRef, { likes: increment(1) });
		batch.set(likesRef, { uid });

		await batch.commit();
	};

	const removeLike = async () => {
		const batch = firestore.batch();

		batch.update(postRef, { likes: increment(-1) });
		batch.delete(likesRef);

		await batch.commit();
	};
	return likesDoc?.exists ? (
		<button onClick={removeLike}>🤍 unlike</button>
	) : (
		<button onClick={addLike}>💗 like</button>
	);
};

export default LikeButton;
