import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CameraIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import { AxiosInstance } from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { ProfileManagementAPI } from '../../services/api';

interface ImageUploadProps {
  axiosInstance: AxiosInstance;
  uploadUrl: string;
  profileUrl: string;
  resourceType: 'image';
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: Error) => void;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

// <<<<<<< HEAD
const ImageUpload: React.FC<ImageUploadProps> = ({
  axiosInstance,
  uploadUrl,
  profileUrl,
  resourceType,
  onUploadSuccess,
  onUploadError,
  maxSizeMB = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp']
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setUser } = useAuthStore();

  const handleFileSelect = useCallback((file: File|undefined) => {
    if (!file) return;

    if (!acceptedFormats.includes(file.type)) {
      toast.error(`Invalid format. Accepted formats: ${acceptedFormats.join(', ')}`);
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSizeMB}MB`);
      return;
    }

    uploadFile(file);
  }, [acceptedFormats, maxSizeMB]);

  const uploadFile = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadStatus('idle');

    try {

      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await axiosInstance.post(`${uploadUrl}/${resourceType}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      const url = uploadRes.data.url;

      await axiosInstance.patch(profileUrl, {
        profile_picture_url: url,
      });

      setUploadStatus('success');
      setUploadProgress(100);

      // Success feedback
      toast.success('Image uploaded successfully!');

      // Invalidate and refresh user profile to get updated profile picture
      try {
        const userInfo = await ProfileManagementAPI.getUserInfo();
        setUser(userInfo);
      } catch (error) {
        console.error('Failed to refresh profile after image upload:', error);
      }

      if (onUploadSuccess) {
        onUploadSuccess(url);
      }

      // Reset after success
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadProgress(0);
      }, 2000);

    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadStatus('error');
      toast.error(error?.response?.data?.message || 'Failed to upload image. Please try again.');
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setIsUploading(false);
    }
  }, [axiosInstance, profileUrl, resourceType, setUser, uploadUrl, onUploadSuccess, onUploadError]);


  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files[0];
    handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFileSelect(file);
  }, [handleFileSelect]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);


  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300
        ${isDragOver
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 scale-105'
          : 'border-secondary-300 dark:border-secondary-600 hover:border-primary-400 dark:hover:border-primary-500'
        }
        ${uploadStatus === 'success' ? 'bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-600' : ''}
        ${uploadStatus === 'error' ? 'bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-600' : ''}
      `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          type="file"
          accept={acceptedFormats.join(',')}
          className="hidden"
          ref={fileInputRef}
          onChange={handleInputChange}
        />

        {uploadStatus === 'idle' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center
                  ${isDragOver
                    ? 'bg-primary-100 dark:bg-primary-900/30'
                    : 'bg-secondary-100 dark:bg-secondary-900/30'
                  }`}>
                <CameraIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
              Drag and drop your image here, or click to browse
            </h3>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              {`Accepted formats: ${acceptedFormats.join(', ')} (Max ${maxSizeMB}MB)`}
            </p>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30">
                <CheckIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
              Image Uploaded Successfully!
            </h3>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
              Upload Failed
            </h3>
          </div>
        )}

        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary-500/10 rounded-xl flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg"
              >
                Drop image here
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isUploading && (
        <div className="mt-4">
          <progress className="w-full h-2 rounded" value={uploadProgress} max="100"></progress>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-2">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;