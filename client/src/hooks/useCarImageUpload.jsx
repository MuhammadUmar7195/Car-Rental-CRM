import { useState } from 'react';
import axios from 'axios';

const useCarImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const uploadImage = async (imageFile) => {
    if (!imageFile) {
      throw new Error('No image file provided');
    }

    // Validate file size (at least 1MB as you mentioned)
    if (imageFile.size < 1 * 1024 * 1024) {
      throw new Error('Image size should be at least 1MB');
    }

    // Validate file size (max 5MB for reasonable upload)
    if (imageFile.size > 5 * 1024 * 1024) {
      throw new Error('Image size should not exceed 5MB');
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile); 

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      setUploading(false);
      return response.data.url; 
    } catch (error) {
      setUploading(false);
      const errorMessage = error.response?.data?.message || 'Image upload failed';
      setUploadError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    uploadImage,
    uploading,
    uploadError,
    clearError: () => setUploadError(null)
  };
};

export default useCarImageUpload;