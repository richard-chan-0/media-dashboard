import axios, { AxiosError, AxiosProgressEvent, AxiosRequestConfig } from "axios"
import { ApiNameChangeResponse, NameChanges } from "./types";
import { NETWORK_ERROR } from "./constants";

type ApiError = {
    code?: string
    response?: {
        data: {
            error: string
        }
    }
};

const processAxiosError = (axiosError: ApiError) => {
    const isWithApiError = !!axiosError?.response?.data?.error;
    if(isWithApiError){
        return axiosError?.response?.data;
    }
    if(axiosError?.code === NETWORK_ERROR){
        return "error could not reach api";
    }
    return JSON.stringify(axiosError);
};

export const postForm = async (apiLink: string, formData: FormData, setUploadProgress?: CallableFunction)  => {
    try {
            const configs: AxiosRequestConfig = {
                headers: { "Content-Type": "multipart/form-data" },
            }
            if(setUploadProgress){
                configs.onUploadProgress = (progressEvent: AxiosProgressEvent) => {
                    if (!progressEvent || !progressEvent.total){
                        return;
                    }
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percent);
                };
            }

            const response = await axios.post(apiLink, formData, configs);
            return response?.data;
        } catch (error) {
            if(error instanceof AxiosError){
                return {"error": processAxiosError(error)};
            }
            console.log(error);
        }
};

export const get = async (apiLink: string)  => {
    try {
            const response = await axios.get(apiLink, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response?.data;
        } catch (error) {
            if(error instanceof AxiosError){
                return {"error": processAxiosError(error)};
            }
            console.log(error);
        }
};

export const postJson = async (apiLink: string, formJson: object) => {
    try {
            const response = await axios.post(apiLink, formJson, {
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
        } catch (error) {
            if(error instanceof AxiosError){
                return error?.response?.data;
            }
            console.log(error);
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