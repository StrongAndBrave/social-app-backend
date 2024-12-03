import { ResultStatus } from "../enums/result.status.enum";
import { ResultObjectModel } from "../models/result-object.model";

export class ResultFactory {
   static createError(message: string, status: ResultStatus): ResultObjectModel<null> {
      return {
         data: null,
         errorMessage: message,
         status: status,
      };
   }

   static createSuccess<G>(message?: string, data?: G): ResultObjectModel<G> {
      return {
         data: data,
         status: ResultStatus.SUCCESS,
      };
   }
}