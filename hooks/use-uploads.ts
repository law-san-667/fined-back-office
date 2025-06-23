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
