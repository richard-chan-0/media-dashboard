import { postJson } from "./api";
import { ffmpegLink } from "../constants";
import { MetadataChanges } from "../types";
import { removePathFromFilePath } from "../utilities";

interface MetadataUtilityWriteChange {
    video_title?: string;
    default_audio?: string;
    default_subtitle?: string;
}
interface MetadataUtilityWriteRequest {
    [key: string]: MetadataUtilityWriteChange;
}

interface MetadataUtilityMergeChange {
    filename: string;
    output_filename?: string;
    audio_tracks?: string;
    subtitle_tracks?: string;
}
interface MetadataUtiliityMergeRequest {
    [key: string]: MetadataUtilityMergeChange;
}

export const postMetadataWrite = async (
    metadataChangeRequest: MetadataChanges,
) => {
    const writeRequest = Object.entries(metadataChangeRequest).reduce(
        (acc, [filename, change]) => {
            acc[filename] = {
                video_title: change.title,
                default_audio: change.defaultAudio,
                default_subtitle: change.defaultSubtitle,
            };
            return acc;
        },
        {} as MetadataUtilityWriteRequest,
    );

    await postJson(`${ffmpegLink}/mkv/write`, writeRequest);
};

export const postMetadataMerge = async (
    metadataChangeRequest: MetadataChanges,
): Promise<MetadataUtiliityMergeRequest> => {
    const mergeRequest = Object.entries(metadataChangeRequest).reduce(
        (acc, [filename, change]) => {
            acc[filename] = {
                filename: removePathFromFilePath(filename),
                output_filename: change.newFilename,
                audio_tracks: `[${change.audiosToKeep?.join(",")}]`,
                subtitle_tracks: `[${change.subtitlesToKeep?.join(",")}]`,
            };
            return acc;
        },
        {} as MetadataUtiliityMergeRequest,
    );

    await postJson(`${ffmpegLink}/mkv/merge`, mergeRequest);

    return mergeRequest;
};
