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

export interface MetadataChanges {
    [key: string]: MetadataChange;
}

export interface MetadataChange {
    newFilename: string;
    title?: string;
    defaultSubtitle?: string;
    defaultAudio?: string;
    audiosToKeep?: string[];
    subtitlesToKeep?: string[];
}
