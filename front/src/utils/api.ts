export let BASE_API_URL = "";

if (process.env.NODE_ENV === "development") {
  BASE_API_URL = "http://localhost:5000";
} else {
  throw new Error("Need to set a prod URL.");
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("files", file, file.name);
  const response = await fetch(`${BASE_API_URL}/api/upload_file/`, {
    method: "POST",
    body: formData,
  });

  const jsonResponse = await response.json();
  const blobName = jsonResponse.blobNames[0];

  return new Promise(() => `${BASE_API_URL}/api/upload_file/${blobName}/`);
}


export default {
  BASE_API_URL,
  
  uploadImage,
}