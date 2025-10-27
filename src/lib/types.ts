import { AxiosError } from "axios";

export type NameChange = {
    input: string;
    output: string;
};

export type NameChanges = {
    changes: NameChange[];
};

export type ApiNameChange = {
    new_path: string;
    old_path: string;
};

export type ApiNameChangeResponse = {
    changes: ApiNameChange[];
};

export type MediaUtiliityApiResponse = {
    error?: AxiosError;
};

export type Stream = {
    is_default: string;
    is_forced: string;
    language: string;
    stream_number: number;
    title: string;
    absolute_track_number: number;
    merge_track_number: number;
};

export type Streams = {
    attachment: object[];
    audio: Stream[];
    subtitle: Stream[];
    is_mkv?: boolean;
};

export type FileStreamsMap = {
    [filename: string]: Streams;
};

export interface MetadataEditChanges {
    [key: string]: MetadataEditChange;
}

export interface MetadataEditChange {
    title?: string;
    defaultSubtitle?: string;
    defaultAudio?: string;
}

export interface MetadataMergeChanges {
    changes: MetadataMergeChange[];
}

export interface MetadataMergeChange {
    filename: string;
    output_filename: string;
    audio_tracks: string;
    subtitle_tracks: string;
}

export interface NameChangeApiRequest {
    changes: {
        old_path: string;
        new_path: string;
    }[];
}

export interface RenameState {
    nameChanges: NameChanges;
    mediaType: string;
}

export type RenameAction =
    | { type: "SET_NAME_CHANGES"; payload: NameChanges }
    | { type: "CLEAR_NAME_CHANGES" }
    | { type: "RESET" }
    | { type: "SET_MEDIA_TYPE"; payload: string };

export interface PageState {
    error: string;
    previewFiles: string[];
}

export type PageAction =
    | { type: "SET_PREVIEWS"; payload: string[] }
    | { type: "SET_ERROR"; payload: string }
    | { type: "RESET" }
    | { type: "CLEAR_ERROR" };

export interface RenameContextType {
    state: RenameState;
    dispatch: React.Dispatch<RenameAction>;
    pageState: PageState;
    pageDispatch: React.Dispatch<PageAction>;
}
