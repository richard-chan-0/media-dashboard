import { postJson } from "./api";
import { ffmpegLink } from "../constants";
import { MetadataEditChanges, MetadataMergeChanges } from "../types";

interface MetadataUtilityWriteChange {
    video_title?: string;
    default_audio?: string;
    default_subtitle?: string;
}
interface MetadataUtilityWriteRequest {
    [key: string]: MetadataUtilityWriteChange;
}

export const postMetadataWrite = async (
    metadataChangeRequest: MetadataEditChanges,
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
    metadataChangeRequest: MetadataMergeChanges,
): Promise<MetadataMergeChanges> => {
    await postJson(`${ffmpegLink}/mkv/merge`, metadataChangeRequest);

    return metadataChangeRequest;
};
