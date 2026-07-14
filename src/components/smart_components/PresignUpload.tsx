import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudArrowUpIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  DocumentIcon,
  PhotoIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { AxiosInstance } from "axios";
import toast from "react-hot-toast";

type ResourceType = "image" | "video" | "documents" | "other";

interface PresignedUrlResponse {
  presignedUrl: string;
  accessUrl: string;
  key: string;
  expiresAt: string;
}

interface UploadMetadataResponse {
  id: string;
  url: string;
  key: string;
  resourceType: ResourceType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  mimetype: string;
}

interface PresignedUploadProps {
  axiosInstance: AxiosInstance;
  presignedUrlEndpoint?: string;
  metadataEndpoint?: string;
  resourceType: ResourceType;
  onUploadSuccess: (dto: {
    url: string;
    _id: string;
    key: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }) => Promise<void> | void;
  onUploadError?: (error: Error) => void;
  maxSizeGB?: number;
  acceptedFormats?: string[];
  label?: string;
}

const DEFAULT_IMAGE_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const DEFAULT_VIDEO_FORMATS = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
];
const DEFAULT_DOCUMENT_FORMATS = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
];

const getDefaultFormats = (resourceType: ResourceType): string[] => {
  switch (resourceType) {
    case "image":
      return DEFAULT_IMAGE_FORMATS;
    case "video":
      return DEFAULT_VIDEO_FORMATS;
    case "documents":
      return DEFAULT_DOCUMENT_FORMATS;
    case "other":
      return [
        ...DEFAULT_IMAGE_FORMATS,
        ...DEFAULT_VIDEO_FORMATS,
        ...DEFAULT_DOCUMENT_FORMATS,
      ];
    default:
      return [];
  }
};

const getDefaultMaxSize = (resourceType: ResourceType): number => {
  switch (resourceType) {
    case "image":
      return 0.05; // 50MB
    case "video":
      return 5; // 5GB
    case "documents":
      return 0.1; // 100MB
    case "other":
      return 5; // 5GB
    default:
      return 5;
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileIcon = (resourceType: ResourceType) => {
  switch (resourceType) {
    case "image":
      return PhotoIcon;
    case "video":
      return VideoCameraIcon;
    case "documents":
      return DocumentIcon;
    default:
      return CloudArrowUpIcon;
  }
};

const PresignedUpload: React.FC<PresignedUploadProps> = ({
  axiosInstance,
  // this the url to get the presigned-url
  presignedUrlEndpoint = "/v1/super-admin/upload/presigned-url",
  // this is the url to save the metadata after upload
  metadataEndpoint = "/v1/super-admin/upload/metadata",
  resourceType,
  onUploadSuccess,
  onUploadError,
  maxSizeGB,
  acceptedFormats,
  label,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [currentFileName, setCurrentFileName] = useState<string>("");
  const [uploadStage, setUploadStage] = useState<
    "idle" | "getting-url" | "uploading" | "saving-metadata"
  >("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const effectiveMaxSizeGB = maxSizeGB ?? getDefaultMaxSize(resourceType);
  const effectiveFormats = acceptedFormats ?? getDefaultFormats(resourceType);
  const FileIcon = getFileIcon(resourceType);

  const handleFileSelect = useCallback(
    (file: File | undefined) => {
      if (!file) return;

      if (!effectiveFormats.includes(file.type)) {
        toast.error(
          `Invalid format. Please select a valid ${resourceType} file.`,
        );
        return;
      }

      const maxSizeBytes = effectiveMaxSizeGB * 1024 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        const maxSizeFormatted =
          effectiveMaxSizeGB >= 1
            ? `${effectiveMaxSizeGB}GB`
            : `${effectiveMaxSizeGB * 1024}MB`;
        toast.error(`File size exceeds ${maxSizeFormatted}`);
        return;
      }

      uploadFile(file);
    },
    [effectiveFormats, effectiveMaxSizeGB, resourceType],
  );

  const uploadFile = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setUploadStatus("idle");
      setCurrentFileName(file.name);
      setUploadProgress(0);

      abortControllerRef.current = new AbortController();

      try {
        setUploadStage("getting-url");
        const safeKey = `${resourceType}/${crypto.randomUUID()}-${file.name}`;

        const presignedResponse =
          await axiosInstance.post<PresignedUrlResponse>(
            presignedUrlEndpoint,
            {
              // fileName: file.name,
              // fileType: file.type,
              // fileSize: file.size,
              // resourceType,
              key: safeKey,
              contentType: file.type,
            },
            { signal: abortControllerRef.current.signal },
          );

        const { presignedUrl, accessUrl, key } = presignedResponse.data;

        setUploadStage("uploading");
        await uploadToDigitalOcean(file, presignedUrl);

        setUploadStage("saving-metadata");
        const metadataResponse =
          await axiosInstance.post<UploadMetadataResponse>(
            metadataEndpoint,
            {
              key,
              url: accessUrl,
              filename: file.name,
              fileSize: file.size,
              mimetype: file.type,
              resourceType,
              size: file.size,
              // url:meta
            },
            { signal: abortControllerRef.current.signal },
          );

        console.log("Metadata saved:", metadataResponse.data);

        setUploadStatus("success");
        setUploadStage("idle");

        onUploadSuccess({
          url: metadataResponse.data.url,
          _id: metadataResponse.data.id,
          key: metadataResponse.data.key,
          fileName: metadataResponse.data.fileName,
          fileSize: metadataResponse.data.fileSize,
          mimeType:
            metadataResponse.data?.mimetype || metadataResponse.data?.mimeType,
        });

        toast.success("File uploaded successfully!");

        setTimeout(() => {
          setUploadStatus("idle");
          setUploadProgress(0);
          setCurrentFileName("");
        }, 2000);
      } catch (error: any) {
        if (error.name === "AbortError" || error.name === "CanceledError") {
          toast.error("Upload cancelled");
        } else {
          console.error("Upload error:", error?.message || error);
          setUploadStatus("error");
          toast.error(
            error?.response?.data?.message ||
              "Failed to upload file. Please try again.",
          );
          if (onUploadError) {
            onUploadError(error);
          }
        }
      } finally {
        setIsUploading(false);
        setUploadStage("idle");
        abortControllerRef.current = null;
      }
    },
    [
      axiosInstance,
      presignedUrlEndpoint,
      metadataEndpoint,
      resourceType,
      onUploadSuccess,
      onUploadError,
    ],
  );

  const uploadToDigitalOcean = async (
    file: File,
    presignedUrl: string,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error during upload"));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload aborted"));
      });

      if (abortControllerRef.current) {
        abortControllerRef.current.signal.addEventListener("abort", () => {
          xhr.abort();
        });
      }

      xhr.open("PUT", presignedUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.setRequestHeader("x-amz-acl", "public-read");
      xhr.send(file);
    });
  };

  const handleCancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);

      const file = event.dataTransfer.files[0];
      handleFileSelect(file);
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(true);
    },
    [],
  );

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      handleFileSelect(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleFileSelect],
  );

  const handleClick = useCallback(() => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  }, [isUploading]);

  const getStageText = () => {
    switch (uploadStage) {
      case "getting-url":
        return "Preparing upload...";
      case "uploading":
        return `Uploading ${currentFileName}... ${uploadProgress}%`;
      case "saving-metadata":
        return "Saving file information...";
      default:
        return "";
    }
  };

  const maxSizeFormatted =
    effectiveMaxSizeGB >= 1
      ? `${effectiveMaxSizeGB}GB`
      : `${Math.round(effectiveMaxSizeGB * 1024)}MB`;

  const getAcceptedFormatsDisplay = () => {
    const formatMap: Record<string, string> = {
      "image/jpeg": "JPEG",
      "image/png": "PNG",
      "image/webp": "WebP",
      "image/gif": "GIF",
      "video/mp4": "MP4",
      "video/webm": "WebM",
      "video/quicktime": "MOV",
      "video/x-msvideo": "AVI",
      "video/x-matroska": "MKV",
      "application/pdf": "PDF",
      "application/msword": "DOC",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "DOCX",
      "application/vnd.ms-excel": "XLS",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        "XLSX",
      "application/vnd.ms-powerpoint": "PPT",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        "PPTX",
      "text/plain": "TXT",
      "text/csv": "CSV",
    };

    return effectiveFormats
      .map((format) => formatMap[format] || format.split("/")[1]?.toUpperCase())
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300
        ${!isUploading ? "cursor-pointer" : "cursor-default"}
        ${
          isDragOver
            ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 scale-105"
            : "border-secondary-300 dark:border-secondary-600 hover:border-primary-400 dark:hover:border-primary-500"
        }
        ${uploadStatus === "success" ? "bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-600" : ""}
        ${uploadStatus === "error" ? "bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-600" : ""}
      `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          type="file"
          accept={effectiveFormats.join(",")}
          className="hidden"
          ref={fileInputRef}
          onChange={handleInputChange}
        />

        {uploadStatus === "idle" && !isUploading && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center
                  ${isDragOver ? "bg-primary-100 dark:bg-primary-900/30" : "bg-secondary-100 dark:bg-secondary-900/30"}`}
              >
                <FileIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
              {label ||
                `Drag and drop your ${resourceType} here, or click to browse`}
            </h3>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              {`Accepted formats: ${getAcceptedFormatsDisplay()}`}
            </p>
            <p className="text-xs text-secondary-400 dark:text-secondary-500">{`Maximum size: ${maxSizeFormatted}`}</p>
          </div>
        )}

        {isUploading && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary-100 dark:bg-primary-900/30">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <CloudArrowUpIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </motion.div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
              {getStageText()}
            </h3>
            {uploadStage === "uploading" && (
              <>
                <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="bg-primary-500 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  {formatFileSize(
                    (uploadProgress / 100) * (currentFileName ? 1 : 0),
                  )}{" "}
                  uploaded
                </p>
              </>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCancelUpload();
              }}
              className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 underline"
            >
              Cancel upload
            </button>
          </div>
        )}

        {uploadStatus === "success" && !isUploading && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30">
                <CheckIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
              File Uploaded Successfully!
            </h3>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              {currentFileName}
            </p>
          </div>
        )}

        {uploadStatus === "error" && !isUploading && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
              Upload Failed
            </h3>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              Click to try again
            </p>
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
                Drop file here
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PresignedUpload;
