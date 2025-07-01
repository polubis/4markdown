import { uploadImageAct } from "acts/upload-image.act";
import { IMAGE_EXTENSIONS } from "api-4markdown-contracts";
import ErrorModal from "components/error-modal";
import { Button } from "design-system/button";
import { Modal } from "design-system/modal";
import { Status } from "design-system/status";
import { readFileAsBase64 } from "development-kit/file-reading";
import { useComboPress } from "development-kit/use-combo-press";
import { useCopy } from "development-kit/use-copy";
import { useFileInput } from "development-kit/use-file-input";
import React from "react";
import { useUploadImageState } from "store/upload-image";
import { UploadImageButton } from "../components/upload-image-button";

const allowedExtensions = IMAGE_EXTENSIONS.map(
	(extension) => `image/${extension}`,
);

const accept = allowedExtensions.join(`, `);
const maxSize = 4;

const readImageAsBase64FromClipboard = async (): Promise<string | null> => {
	try {
		const clipboardItems = await navigator?.clipboard.read();

		for (const item of clipboardItems) {
			const element = item.types[0];

			if (allowedExtensions.includes(element)) {
				const blob = await item.getType(item.types[0]);
				return await readFileAsBase64(blob);
			}
		}

		return null;
	} catch {
		return null;
	}
};

const ImageUploaderAuthContainer = () => {
	const uploadImageStatus = useUploadImageState();
	const [copyState, copy, resetClipboard] = useCopy();

	useComboPress([`control`, `v`], async () => {
		if (uploadImageStatus.is !== `idle`) return;

		const image = await readImageAsBase64FromClipboard();

		if (!image) return;

		await uploadImageAct(image);
	});

	const [upload] = useFileInput({
		accept,
		maxSize,
		onChange: async ({ target: { files } }) => {
			if (!!files && files.length === 1) {
				if (uploadImageStatus.is !== `idle`) return;
				await uploadImageAct(await readFileAsBase64(files[0]));
			}
		},
		onError: () =>
			useUploadImageState.swap({
				is: `fail`,
				error: { symbol: `unknown`, content: `Unknown`, message: `Unknown` },
			}),
	});

	const copyAndClose = (): void => {
		if (uploadImageStatus.is !== `ok`)
			throw Error(`There is no data assigned to image modal`);

		copy(`![Alt](${uploadImageStatus.url})\n*Description*`);

		useUploadImageState.reset();
	};

	const close = async (): Promise<void> => {
		await resetClipboard();
		useUploadImageState.reset();
	};

	return (
		<>
			{copyState.is === `copied` && <Status>Image copied</Status>}

			{uploadImageStatus.is === `busy` && <Status>Uploading image...</Status>}

			{uploadImageStatus.is === `ok` && (
				<Modal onClose={close}>
					<Modal.Header
						title="Image uploaded ✅"
						closeButtonTitle="Close image upload"
					/>
					<p>
						To use <strong>uploaded image</strong> in markdown editor click
						below button.
					</p>
					<Button
						title="Copy image link"
						className="capitalize mt-8 ml-auto"
						auto
						s={2}
						i={2}
						onClick={copyAndClose}
					>
						Copy Link
					</Button>
				</Modal>
			)}

			{uploadImageStatus.is === `fail` && (
				<ErrorModal
					heading="Invalid image"
					message={
						<>
							Please ensure that the image format is valid. Supported formats
							include <strong>{accept}</strong>, with a maximum file size of
							{` `}
							<strong>{maxSize} megabytes</strong>
						</>
					}
					onClose={close}
				/>
			)}

			<UploadImageButton
				disabled={uploadImageStatus.is === `busy`}
				onClick={upload}
			/>
		</>
	);
};

export { ImageUploaderAuthContainer };
