import { useState, ChangeEvent, useRef } from "react";

type Props = {
  onUploadSuccess: () => void;
};

export default function FileUpload({ onUploadSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);

      const formData = new FormData();
      formData.append("benchmark", file);

      const response = await fetch(`/categories/${1}/benchmarks/create`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Upload failed");
        setUploadStatus("Upload failed");
      }

      const data = await response.json();

      setUploadStatus(`Upload successful: ${JSON.stringify(data)}`);

      onUploadSuccess();
    }
  };

  return (
    <label>
      <h3>Upload Benchmark</h3>
      <input
        type="file"
        onChange={handleFileChange}
        style={{
          visibility: "hidden",
        }}
      />
    </label>
  );
}
