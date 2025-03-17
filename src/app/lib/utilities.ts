
export const removePathFromFilePath = (filePath: string) => {
    const lastIndexOfSlash = filePath.lastIndexOf("/");
    return filePath.substring(lastIndexOfSlash+1);
}

export const getWidthSize = (size: number | undefined) => {
    if (size === undefined) {
        return "w-full";
    }
    switch (size) {
        case 0:
            return "w-2xs"
        case 1:
            return "w-xs"
        case 2:
            return "w-sm"
        case 3:
            return "w-md"
        case 4:
            return "w-lg"
        case 5:
            return "w-xl"
        case 6:
            return "w-2xl"
        case 7:
            return "w-3xl"
        default:
            return "w-lg"
    }
}