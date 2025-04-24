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
