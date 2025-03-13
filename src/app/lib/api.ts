import axios from "axios"
import { ApiNameChangeResponse, NameChanges } from "./types";

export const postForm = async (apiLink: string, formData: FormData) => {
    try {
            const response = await axios.post(apiLink, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response?.data;
        } catch (error) {
            return error;
        }
};

export const postJson = async (apiLink: string, formJson: object) => {
    try {
            const response = await axios.post(apiLink, formJson, {
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
        } catch (error) {
            console.error("Error uploading:", error);
        }
}

export const processApiResponseToNameChange = (response: ApiNameChangeResponse): NameChanges => {
    const fileChanges = response?.changes;
    if(!fileChanges){
        return {
            changes: []
        }
    }
    const changes = fileChanges.map((change) => {
        return {
            input: change.old_path,
            output: change.new_path
        }
    })

    return {
        changes
    }
}

export const processNameChangeToApiRequest = (request: NameChanges) => {
    const fileChanges = request?.changes;
    if(!fileChanges){
        return {
            changes: []
        }
    }
    const changes = fileChanges.map((change) => {
        return {
            old_path: change.input,
            new_path: change.output
        }
    })

    return {
        changes
    }
}