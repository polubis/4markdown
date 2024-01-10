import React from 'react';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import Popover from 'design-system/popover';
// import { uploadImage } from './../development-kit/with-auth';

interface UploadImagePopoverContentProps {
  onClose(): void;
}

const UploadImagePopoverContent: React.FC<UploadImagePopoverContentProps> = ({
    onClose,
  }) => {
    const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
    const [imageName, setImageName] = React.useState('');
    const [imageDescription, setImageDescription] = React.useState('');
  
    const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const file = e.target.files?.[0] || null;
      setSelectedImage(file);
      setImageName(file?.name || '');
    };
  
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
      e.preventDefault();
  
      if (selectedImage) {
        try {
          // implementacja uploadImage
  
          onClose();
        } catch (error) {
          // Tutaj możesz dodać obsługę błędu
          console.error('Error uploading image:', error);
        }
      }
    };
  
    return (
      <Popover
        className="bottom-20 left-2 md:bottom-auto md:top-16"
        onBackdropClick={onClose}
      >
        <form className="max-w-[280px] flex flex-col" onSubmit={handleSubmit}>
          <div className="flex items-center mb-2">
            <h6 className="text-xl">Upload Image</h6>
            <Button
              type="button"
              i={2}
              s={1}
              title="Close image upload"
              className="ml-8"
              onClick={onClose}
            >
              <BiX />
            </Button>
          </div>
          <fieldset className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Select Image*</label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              className="px-3 py-2 text-sm rounded-md bg-gray-300 dark:bg-slate-800 border-[2.5px] border-transparent focus:border-black focus:dark:border-white outline-none"
            />
          </fieldset>
          <fieldset className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Image Name*</label>
            <input
              placeholder="Type image name..."
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              className="px-3 py-2 placeholder:text-gray-600 dark:placeholder:text-gray-300 text-sm rounded-md bg-gray-300 dark:bg-slate-800 border-[2.5px] border-transparent focus:border-black focus:dark:border-white outline-none"
            />
          </fieldset>
          <fieldset className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Description (optional)</label>
            <textarea
              placeholder="Type image description..."
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              className="px-3 py-2 placeholder:text-gray-600 dark:placeholder:text-gray-300 text-sm rounded-md bg-gray-300 dark:bg-slate-800 border-[2.5px] border-transparent focus:border-black focus:dark:border-white outline-none resize-none"
            />
          </fieldset>
          <Button
            type="submit"
            i={2}
            s={2}
            className="mt-6"
            auto
            title="Upload image"
            disabled={!selectedImage}
          >
            Upload
          </Button>
        </form>
      </Popover>
    );
  };
  
  export default UploadImagePopoverContent;