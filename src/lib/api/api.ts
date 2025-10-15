import axios, {
    AxiosError,
    AxiosProgressEvent,
    AxiosRequestConfig,
} from "axios";
import { CANCELLED_ERROR, NETWORK_ERROR } from "../constants";
import React from "react";
import { UploadAction } from "../reducers/uploadReducer";

export interface ApiError {
    code?: string;
    response?: {
        data: {
            error: string;
        };
    };
}

const processAxiosError = (axiosError: ApiError) => {
    const isWithApiError = !!axiosError?.response?.data?.error;
    if (isWithApiError) {
        return axiosError?.response?.data?.error;
    }
    if (axiosError?.code === NETWORK_ERROR) {
        return "error could not reach api";
    }
    if (axiosError?.code === CANCELLED_ERROR) {
        return "upload cancelled";
    }
    return JSON.stringify(axiosError);
};

export const postForm = async (
    apiLink: string,
    formData: FormData,
    uploadDispatcher?: React.Dispatch<UploadAction>,
    abortSignal?: AbortSignal,
) => {
    try {
        const configs: AxiosRequestConfig = {
            headers: { "Content-Type": "multipart/form-data" },
        };
        if (uploadDispatcher) {
            configs.onUploadProgress = (progressEvent: AxiosProgressEvent) => {
                if (!progressEvent || !progressEvent.total) {
                    return;
                }
                const percent = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total,
                );
                uploadDispatcher({
                    type: "UPDATE_PROGRESS",
                    payload: { uploadPercent: percent },
                });
            };
        }
        if (abortSignal) {
            configs.signal = abortSignal;
        }

        const response = await axios.post(apiLink, formData, configs);
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return { error: processAxiosError(error) };
        }
    }
};

export const get = async (apiLink: string) => {
    try {
        const response = await axios.get(apiLink, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return { error: processAxiosError(error) };
        }
    }
};

export const postJson = async (apiLink: string, formJson: object) => {
    try {
        const response = await axios.post(apiLink, formJson, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return error?.response?.data;
        }
    }
};
