
export const removePathFromFilePath = (filePath: string) => {
    const lastIndexOfSlash = filePath.lastIndexOf("/");
    return filePath.substring(lastIndexOfSlash+1);
}

