import { useSupabaseUpload } from "./use-supabase-upload";

export const usePackThumbnailUpload = () => {
  const props = useSupabaseUpload({
    bucketName: "packs",
    path: "thumbnail",
    allowedMimeTypes: ["image/*"],
    maxFiles: 1,
    maxFileSize: 1024 * 1024 * 16,
    upsert: true,
  });

  return props;
};

export const useDocumentUpload = () => {
  const props = useSupabaseUpload({
    bucketName: "documents",
    allowedMimeTypes: ["application/pdf"],
    maxFiles: 1,
    maxFileSize: 1024 * 1024 * 50,
    upsert: true,
  });

  return props;
};

export const useDocumentThumbnailUpload = () => {
  const props = useSupabaseUpload({
    bucketName: "documents",
    path: "thumbnail",
    allowedMimeTypes: ["image/*"],
    maxFiles: 1,
    maxFileSize: 1024 * 1024 * 16,
    upsert: true,
  });

  return props;
};

export const useVideoUpload = () => {
  const props = useSupabaseUpload({
    bucketName: "videos",
    allowedMimeTypes: ["video/*"],
    maxFiles: 1,
    maxFileSize: 1024 * 1024 * 50,
    upsert: true,
  });

  return props;
};

export const useVideoThumbnailUpload = () => {
  const props = useSupabaseUpload({
    bucketName: "videos",
    path: "thumbnail",
    allowedMimeTypes: ["image/*"],
    maxFiles: 1,
    maxFileSize: 1024 * 1024 * 16,
    upsert: true,
  });

  return props;
};
