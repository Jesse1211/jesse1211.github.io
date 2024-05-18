import { useEffect, useState } from "react";
import { educationService } from "../services/education-service";
import { Education, RequestType } from "../models/Categories";

export function useEducation(
  requestType: RequestType,
  id?: string,
  education?: Education,
): {
  busy: boolean;
  responseEducation?: Education | Education[] | string;
  error?: Error;
} {
  const [responseEducation, setResponseEducation] = useState<
    Education | Education[] | string
  >();
  const [busy, setBusy] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    switch (requestType) {
      case "GETONE":
        if (id !== undefined) {
          educationService
            .getEducation(id)
            .then((result) => {
              if (!signal.aborted) {
                setResponseEducation(result);
              }
            })
            .catch((e: Error) => signal.aborted || setError(e))
            .finally(() => signal.aborted || setBusy(false));
        } else setResponseEducation("No ID provided");
        break;
      case "GETALL":
        educationService
          .getEducations()
          .then((result) => {
            if (!signal.aborted) {
              setResponseEducation(result);
            }
          })
          .catch((e: Error) => signal.aborted || setError(e))
          .finally(() => signal.aborted || setBusy(false));
        break;
      case "UPDATE":
        if (education !== undefined) {
          educationService
            .updateEducation(education)
            .then((result) => {
              if (!signal.aborted) {
                setResponseEducation(result);
              }
            })
            .catch((e: Error) => signal.aborted || setError(e))
            .finally(() => signal.aborted || setBusy(false));
        } else setResponseEducation("No data provided");
        break;
      case "DELETEONE":
        if (id !== undefined) {
          educationService
            .deleteEducation(id)
            .then((result) => {
              if (!signal.aborted) {
                setResponseEducation(result);
              }
            })
            .catch((e: Error) => signal.aborted || setError(e))
            .finally(() => signal.aborted || setBusy(false));
        }
        break;
      case "DELETEALL":
        educationService
          .deleteAllEducation()
          .then((result) => {
            if (!signal.aborted) {
              setResponseEducation(result);
            }
          })
          .catch((e: Error) => signal.aborted || setError(e))
          .finally(() => signal.aborted || setBusy(false));
        break;
      default:
        break;
    }

    return () => abortController.abort();
  }, [id, education, requestType]);

  return { busy, responseEducation, error };
}
