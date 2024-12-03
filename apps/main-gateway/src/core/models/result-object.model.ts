import { ResultStatus } from "../enums/result.status.enum";

export interface ResultObjectModel<G> {
    data: null | G | undefined;
    errorMessage?: string;
    status: ResultStatus;
}