import { useEffect, useState } from "react";
import { projectService } from "../services/project-service";

export function useProject(): {
  busy: boolean;
  ChatResponse?: string;
  error?: Error;
} {
  const [ChatResponse, setChatResponse] = useState<string>();

  const [busy, setBusy] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    projectService.addProject()
    .then(
      (result) => {
        if (!signal.aborted) {
          setChatResponse(result);
        }
      }
    )
    .catch((e: Error) => signal.aborted || setError(e))
    .finally(() => signal.aborted || setBusy(false));

    return () => abortController.abort();
  }, []);

  return { busy, ChatResponse, error };
}
