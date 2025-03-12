import axios from "axios"

export const postForm = async (apiLink: string, formData: FormData) => {
    try {
            const response = await axios.post(apiLink, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(response.data);
        } catch (error) {
            console.error("Error uploading:", error);
        }
}