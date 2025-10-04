export type UploadState = {
    isUploading: boolean;
    uploadPercent: number;
}

export type UploadAction = {
    type: string;
    payload?: Partial<UploadState>;
}

export const uploadReducer = (state: UploadState, action: UploadAction) => {
    switch(action.type) {
        case "START_UPLOAD":
            return { isUploading: true, uploadPercent: 0};
        case "UPDATE_PROGRESS":
            return { ...state, uploadPercent: action.payload?.uploadPercent || 0 };
        case "RESET_UPLOAD":
            return { isUploading: false, uploadPercent: 0 };
        default:
            return state;
    }
};