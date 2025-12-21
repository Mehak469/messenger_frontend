"use client";

import { useUploadThing } from "@/utils/uploadthing";
import { useState } from "react";

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);

  const { startUpload, isUploading } = useUploadThing(
    "mediaUploader",
    {
      onClientUploadComplete: (res) => {
        console.log("UPLOAD SUCCESS:", res);
        alert("Uploaded! CDN URL:\n" + res[0].url);
      },
      onUploadError: (err) => {
        console.error("UPLOAD ERROR:", err);
      },
    }
  );

  return (
    <div className="p-6 space-y-4">
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        disabled={!file || isUploading}
        onClick={() => file && startUpload([file])}
        className="px-4 py-2 bg-black text-white rounded"
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
