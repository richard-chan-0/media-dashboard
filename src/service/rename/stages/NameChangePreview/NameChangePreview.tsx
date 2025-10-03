import FormContainer from "../../../../lib/components/FormContainer";
import NameChangeTable from "../../../../lib/components/NameChangeTable";
import { NameChangeApiRequest, postJson, processNameChangeToApiRequest } from "../../../../lib/api";
import SubmitButton from "../../../../lib/components/SubmitButton";
import StageNavButtons from "../StageNavButtons";
import { COMICS, mediaLink, no_api_error, VIDEOS, ffmpegLink } from "../../../../lib/constants";
import { useRename } from "../../../../lib/hooks/usePageContext";
import { useState } from "react";
import Spinner from "../../../../lib/components/Spinner";
import { MetadataChanges, MetadataChange } from "../../../../lib/types";
import { removePathFromFilePath } from "../../../../lib/utilities";
import { useDeleteFile } from "../../../../lib/hooks/useDeleteFile";

interface NameChangePreviewProps {
    stageDispatcher: React.ActionDispatch<[action: string]>;
};

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

const NameChangePreview = ({ stageDispatcher }: NameChangePreviewProps) => {
    const { state, dispatch, pageDispatch } = useRename();
    const [isSpinner, setIsSpinner] = useState(false);
    const [metadataChanges, setMetadataChanges] = useState<MetadataChanges>();
    const [isMetadataChange, setIsMetadataChange] = useState(false);
    const deleteFile = useDeleteFile();

    const handleMetadataChange = (filename: string, newChange: MetadataChange, isChange: boolean) => {
        console.log("Handling metadata change:", filename, newChange, isChange);
        setMetadataChanges((prevChanges) => ({
            ...prevChanges,
            [filename]: newChange
        }));
        setIsMetadataChange(isMetadataChange || isChange);
    };

    const postRenameChangeRequest = async (nameChangeRequest: NameChangeApiRequest) => {
        console.log("Posting name changes:", nameChangeRequest);
        return await postJson(
            `${mediaLink}/rename/process`,
            nameChangeRequest,
        );
    }

    const postMetadataRenameChangeRequest = async (metadataChangeRequest: MetadataChanges) => {
        console.log("Posting metadata changes:", metadataChangeRequest);
        const writeRequest = Object.entries(metadataChangeRequest).reduce((acc, [filename, change]) => {
            acc[filename] = {
                video_title: change.title,
                default_audio: change.defaultAudio,
                default_subtitle: change.defaultSubtitle,
            };
            return acc;
        }, {} as MetadataUtilityWriteRequest);

        await postJson(
            `${ffmpegLink}/mkv/write`,
            writeRequest,
        );

        const mergeRequest = Object.entries(metadataChangeRequest).reduce((acc, [filename, change]) => {
            acc[filename] = {
                filename: removePathFromFilePath(filename),
                output_filename: change.newFilename,
                audio_tracks: `[${change.audiosToKeep?.join(",")}]`,
                subtitle_tracks: `[${change.subtitlesToKeep?.join(",")}]`,
            };
            return acc;
        }, {} as MetadataUtiliityMergeRequest);

        await postJson(
            `${ffmpegLink}/mkv/merge`,
            mergeRequest,
        );

        Object.keys(mergeRequest).forEach(async (filename) => {
            await deleteFile(removePathFromFilePath(filename));
        });

    }

    const handleSubmit = async () => {
        pageDispatch({ type: "CLEAR_ERROR" });
        if (!mediaLink || !ffmpegLink) {
            pageDispatch({ type: "SET_ERROR", payload: no_api_error });
            return;
        }
        const nameChangeRequest = processNameChangeToApiRequest(
            state.nameChanges,
        );
        setIsSpinner(true);
        const response = await (
            isMetadataChange && metadataChanges ?
                postMetadataRenameChangeRequest(metadataChanges) :
                postRenameChangeRequest(nameChangeRequest)
        );
        if (response?.error) {
            pageDispatch({ type: "SET_ERROR", payload: response.error });
        } else {
            dispatch({ type: "CLEAR_NAME_CHANGES" });
            stageDispatcher("reset");
        }
        setIsSpinner(false);
    };

    const isNameChanges = state.nameChanges.changes.length > 0;
    const navProps = state.mediaType == COMICS ? {
        leftLabel: "Back",
        isLeftEnabled: true,
        leftButtonAction: () => stageDispatcher("prev"),
    } : {
        leftLabel: "Back",
        rightLabel: isNameChanges ? "Skip" : "Next",
        isLeftEnabled: true,
        leftButtonAction: () => stageDispatcher("prev"),
    }

    return (
        <FormContainer
            formTitle="Rename Files"
            containerStyle="flex flex-col gap-2"
            size={5}
        >
            <StageNavButtons
                {...navProps}
            />
            {
                isNameChanges && (
                    <>
                        <NameChangeTable
                            nameChanges={state.nameChanges}
                            mediaType={state.mediaType}
                            onEdit={state.mediaType === VIDEOS ? handleMetadataChange : () => { }}
                        />
                        <div className="flex justify-center gap-4">
                            {
                                isSpinner ? (
                                    <Spinner />
                                ) : (

                                    <SubmitButton
                                        onClick={handleSubmit}
                                        label="Rename!"
                                        type="button"
                                        buttonStyle="w-fit"
                                    />


                                )
                            }
                        </div>
                    </>
                )
            }
            {
                !isNameChanges && (
                    <div className="flex justify-center">
                        <p className="text-lg text-gray-500">
                            No files to rename.
                        </p>
                    </div>
                )
            }
        </FormContainer>
    );
};

export default NameChangePreview;
