import { useEffect, useState } from "react";
import { experienceService } from "../services/experience-service";
import { Experience } from "../models/Categories";
import { RequestType } from "../models/User";

export function useExperience(
  requestType: RequestType,
  id?: string,
  experience?: Experience,
): {
  busy: boolean;
  responseexperience?: Experience | Experience[] | string;
  error?: Error;
} {
  const [responseexperience, setResponseexperience] = useState<
    Experience | Experience[] | string
  >();
  const [busy, setBusy] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    switch (requestType) {
      case "GETONE":
        if (id !== undefined) {
          experienceService
            .getExperience(id)
            .then((result) => {
              if (!signal.aborted) {
                setResponseexperience(result);
              }
            })
            .catch((e: Error) => signal.aborted || setError(e))
            .finally(() => signal.aborted || setBusy(false));
        } else setResponseexperience("No ID provided");
        break;
      case "GETALL":
        experienceService
          .getExperiences()
          .then((result) => {
            if (!signal.aborted) {
              setResponseexperience(result);
            }
          })
          .catch((e: Error) => signal.aborted || setError(e))
          .finally(() => signal.aborted || setBusy(false));
        break;
      case "UPDATE":
        if (experience !== undefined) {
          experienceService
            .updateExperience(experience)
            .then((result) => {
              if (!signal.aborted) {
                setResponseexperience(result);
              }
            })
            .catch((e: Error) => signal.aborted || setError(e))
            .finally(() => signal.aborted || setBusy(false));
        } else setResponseexperience("No data provided");
        break;
      case "DELETEONE":
        if (id !== undefined) {
          experienceService
            .deleteExperience(id)
            .then((result) => {
              if (!signal.aborted) {
                setResponseexperience(result);
              }
            })
            .catch((e: Error) => signal.aborted || setError(e))
            .finally(() => signal.aborted || setBusy(false));
        }
        break;
      case "DELETEALL":
        experienceService
          .deleteAllExperience()
          .then((result) => {
            if (!signal.aborted) {
              setResponseexperience(result);
            }
          })
          .catch((e: Error) => signal.aborted || setError(e))
          .finally(() => signal.aborted || setBusy(false));
        break;
      default:
        break;
    }

    return () => abortController.abort();
  }, [id, experience, requestType]);

  return { busy, responseexperience, error };
}
