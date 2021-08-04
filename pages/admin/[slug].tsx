import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import AuthCheck from "../../components/AuthCheck";
import { PostType } from "../../lib/context";
import { auth, firestore, serverTimeStamp } from "../../lib/firebase";
import Link from "next/link";
import ImageUploader from "../../components/ImageUploader";

const AdminPostEdit = () => {
	return (
		<AuthCheck>
			<PostManager />
		</AuthCheck>
	);
};

export default AdminPostEdit;

export const PostManager = () => {
	const [preview, setPreview] = useState(false);

	const router = useRouter();
	const { slug } = router.query;

	const postRef = firestore
		.collection("users")
		.doc(auth.currentUser?.uid)
		.collection("posts")
		.doc(slug as string);
	const [post] = useDocumentData<PostType>(postRef);

	return (
		<main>
			{post && (
				<>
					<section>
						<h1>{post.title}</h1>
						<p>ID: {post.slug}</p>

						<PostForm
							postRef={postRef}
							defaultValues={post}
							preview={preview}
						/>
					</section>

					<aside>
						<h3>Tools</h3>
						<button onClick={() => setPreview(!preview)}>
							{preview ? "Edit" : "Preview"}
						</button>
						<Link href={`/${post.username}/${post.slug}`}>
							<button>Live view</button>
						</Link>
					</aside>
				</>
			)}
		</main>
	);
};

interface PostFormProps {
	defaultValues: PostType;
	postRef: any;
	preview: boolean;
}

export const PostForm: React.FC<PostFormProps> = ({
	defaultValues,
	postRef,
	preview,
}) => {
	const { register, handleSubmit, reset, watch, formState } = useForm({
		defaultValues,
		mode: "onChange",
	});

	const { isDirty, isValid, errors } = formState;

	const updatePost = async ({ content, published }: PostType) => {
		await postRef.update({
			content,
			published,
			updatedAt: serverTimeStamp(),
		});

		reset({ content, published });
	};

	return (
		<form onSubmit={handleSubmit(updatePost)}>
			{preview && (
				<div className="">
					<ReactMarkdown>{watch("content")}</ReactMarkdown>
				</div>
			)}

			<ImageUploader />

			<div className={preview ? "hidden" : "flex"}>
				<textarea
					{...register("content", {
						maxLength: { value: 20000, message: "content is too long" },
						minLength: { value: 10, message: "content is too short" },
						required: { value: true, message: "content is required" },
					})}
					name="content"
				></textarea>

				{errors.content && <p>{errors.content.message}</p>}

				<fieldset>
					<input {...register("published")} type="checkbox" name="published" />
					<label>Published</label>
				</fieldset>

				<button type="submit" disabled={!isDirty || !isValid}>
					Save Changes
				</button>
			</div>
		</form>
	);
};
