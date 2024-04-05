import { useEffect, useState } from "react";
import { userService } from "../services/user-service";
import { User } from "../models/User";

export function useUserLogin(
  isLogin: boolean,
  user: User
): {
  busy: boolean;
  response?: string;
  error?: Error;
} {
  const [response, setResponse] = useState<string>();
  const [busy, setBusy] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    isLogin ? 
    userService.login(user)
    .then(
      (result) => {
        if (!signal.aborted) {
          setResponse(result);
        }
      }
    )
    .catch((e: Error) => signal.aborted || setError(e))
    .finally(() => signal.aborted || setBusy(false))
    : userService.register(user)
    .then(
      (result) => {
        if (!signal.aborted) {
          setResponse(result);
        }
      }
    )
    .catch((e: Error) => signal.aborted || setError(e))
    .finally(() => signal.aborted || setBusy(false));

    return () => abortController.abort();
  }, [isLogin, user]);

  return { busy, response, error };
}
