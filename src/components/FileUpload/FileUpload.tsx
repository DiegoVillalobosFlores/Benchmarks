import { benchmarkRoutePaths } from "@/routes/api/benchmarks";
import { useState, ChangeEvent } from "react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);

      const formData = new FormData();
      formData.append("benchmark", file);

      const response = await fetch(benchmarkRoutePaths.create, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Upload failed");
        setUploadStatus("Upload failed");
      }

      const data = await response.json();

      setUploadStatus(`Upload successful: ${JSON.stringify(data)}`);

      location.reload();
    }
  };

  return (
    <div>
      <label>
        Upload Benchmark:
        <input type="file" onChange={handleFileChange} />
      </label>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
}
