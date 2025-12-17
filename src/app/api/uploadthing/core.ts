import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  mediaUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    video: { maxFileSize: "16MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    console.log("Uploaded file:", file.url);

    return {
      url: file.url, // CDN URL
    };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
