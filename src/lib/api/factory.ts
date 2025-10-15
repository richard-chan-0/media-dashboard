import { ApiNameChangeResponse, NameChanges } from "../types";
import { NameChangeApiRequest } from "../types";

export const createNameChanges = (
    response: ApiNameChangeResponse,
): NameChanges => {
    const fileChanges = response?.changes;
    if (!fileChanges) {
        return {
            changes: [],
        };
    }
    const changes = fileChanges.map((change) => {
        return {
            input: change.old_path,
            output: change.new_path,
        };
    });

    return {
        changes,
    };
};

export const createNameChangeApiRequest = (
    request: NameChanges,
): NameChangeApiRequest => {
    const fileChanges = request?.changes;
    if (!fileChanges) {
        return {
            changes: [],
        };
    }
    const changes = fileChanges.map((change) => {
        return {
            old_path: change.input,
            new_path: change.output,
        };
    });

    return {
        changes,
    };
};
