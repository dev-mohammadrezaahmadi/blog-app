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
import toast from "react-hot-toast";

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
				<div className="flex flex-col  md:flex-row w-full md:w-4/5 md:mx-auto">
					<section className=" p-4 w-full order-2 md:order-1 md:w-5/6 bg-white rounded-md shadow-sm">
						<h1 className="font-bold text-2xl">{post.title}</h1>
						<p>ID: {post.slug}</p>

						<PostForm
							postRef={postRef}
							defaultValues={post}
							preview={preview}
						/>
					</section>

					<aside className="w-full order-1 md:order-1 md:w-2/6 flex justify-center">
						<div className="bg-white lg:w-72 w-full md:w-48 h-3/6 rounded-md shadow-sm p-4 flex flex-col">
							<h3 className="font-bold uppercase text-3xl mb-10">Tools</h3>
							<button
								className="btn--outline btn--outline-blue"
								onClick={() => setPreview(!preview)}
							>
								{preview ? "Edit" : "Preview"}
							</button>
							<Link href={`/${post.username}/${post.slug}`}>
								<button className="mt-5 btn--outline btn--outline-green">
									Live view
								</button>
							</Link>
						</div>
					</aside>
				</div>
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
		toast.success("Post added. 😀yay!!");
	};

	return (
		<form
			style={{ height: "600px" }}
			className=" w-full flex flex-col mt-4"
			onSubmit={handleSubmit(updatePost)}
		>
			{!preview && <ImageUploader />}

			{preview && (
				<div className="h-full rounded-br-sm rounded-bl-sm p-4 bg-gray-200 ">
					<ReactMarkdown>{watch("content")}</ReactMarkdown>
				</div>
			)}

			<div className={`flex h-5/6 flex-col			${preview ? "hidden" : "flex"}`}>
				<textarea
					className="h-full rounded-br-sm rounded-bl-sm p-4 bg-gray-200"
					{...register("content", {
						maxLength: { value: 20000, message: "content is too long" },
						minLength: { value: 10, message: "content is too short" },
						required: { value: true, message: "content is required" },
					})}
					name="content"
				></textarea>

				<div className="flex justify-between py-4">
					<div>
						{errors.content && (
							<p className="flex items-center text-lg h-10 text-red-500 font-bold">
								{errors.content.message} !
							</p>
						)}
					</div>
					<div className="flex">
						<fieldset className="btn cursor-auto font-semibold">
							<input
								{...register("published")}
								type="checkbox"
								name="published"
							/>
							<label className="ml-2">Published</label>
						</fieldset>

						<button
							className="btn--outline"
							type="submit"
							disabled={!isDirty || !isValid}
						>
							Save Changes
						</button>
					</div>
				</div>
			</div>
		</form>
	);
};
