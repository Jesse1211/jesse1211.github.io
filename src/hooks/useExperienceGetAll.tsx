import { useEffect, useState } from "react";
import { experienceService } from "../services/experience-service";
import { Experience } from "../models/Categories";

export function useExperienceGetAll(): {
  busy: boolean;
  responseExperience?: Experience[];
  error?: Error;
} {
  const [responseExperience, setResponseExperience] = useState<Experience[]>();
  const [busy, setBusy] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    experienceService
      .getExperiences()
      .then((result) => {
        if (!signal.aborted) {
          setResponseExperience(result);
        }
      })
      .catch((e: Error) => signal.aborted || setError(e))
      .finally(() => signal.aborted || setBusy(false));

    return () => abortController.abort();
  }, []);

  return { busy, responseExperience, error };
}
