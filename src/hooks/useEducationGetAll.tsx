import { useEffect, useState } from "react";
import { educationService } from "../services/education-service";
import { Education } from "../models/Categories";

export function useEducationGetAll(): {
  busy: boolean;
  responseEducation?: Education[];
  error?: Error;
} {
  const [responseEducation, setResponseEducation] = useState<Education[]>();
  const [busy, setBusy] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    educationService
    .getEducations()
    .then((result) => {
      if (!signal.aborted) {
        setResponseEducation(result);
      }
    })
    .catch((e: Error) => signal.aborted || setError(e))
    .finally(() => signal.aborted || setBusy(false));

    return () => abortController.abort();
  }, []);

  return { busy, responseEducation, error };
}
