import { useState } from "react";
import { auth, storage, STATE_CHANGED } from "../lib/firebase";
import Loader from "./Loader";

const ImageUploader = () => {
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [downloadURL, setDownloadURL] = useState(null);

	// Creates a firebase upload task
	const uploadFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
		// Get the file
		const file = Array.from(e.target.files as FileList)[0];
		const extension = file.type.split("/")[1];

		// Makes refrence to the storage bucket location
		const ref = storage.ref(
			`uploads/${auth.currentUser?.uid}/${Date.now()}.${extension}`
		);
		setUploading(true);

		// Starts the upload
		const task = ref.put(file);

		// Listen to updates to upload task
		task.on(STATE_CHANGED, (snapshot) => {
			const percentage: number = Number(
				((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
			);
			setProgress(percentage);

			// Get downloadURL AFTER task resolves
			task
				.then((d) => ref.getDownloadURL())
				.then((url) => {
					setDownloadURL(url);
					setUploading(false);
				});
		});
	};

	return (
		<div className="w-full p-2 bg-red-300 flex flex-col rounded-tr-sm rounded-tl-sm">
			<Loader show={uploading} />
			{uploading && <h3>{progress}%</h3>}

			{!uploading && (
				<>
					<label className="capitalize">
						📸 Upload Your Image file
						<input
							className="ml-2"
							type="file"
							onChange={uploadFile}
							accept="image/x-png,image/git,image/jpeg"
						/>
					</label>
				</>
			)}

			{downloadURL && (
				<code className="break-none overflow-x-scroll">{`![alt](${downloadURL})`}</code>
			)}
		</div>
	);
};

export default ImageUploader;
