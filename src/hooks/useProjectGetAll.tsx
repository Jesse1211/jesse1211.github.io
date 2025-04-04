// import { useEffect, useState } from "react";
// import { projectService } from "../services/project-service";
// import { Project } from "../models/Categories";

// export function useProjectGetAll(): {
//   busy: boolean;
//   responseProject?: Project[];
//   error?: Error;
// } {
//   const [responseProject, setResponseProject] = useState<Project[]>();
//   const [busy, setBusy] = useState<boolean>(true);
//   const [error, setError] = useState<Error>();

//   useEffect(() => {
//     const abortController = new AbortController();
//     const signal = abortController.signal;
//     projectService
//       .getProjects()
//       .then((result) => {
//         if (!signal.aborted) {
//           setResponseProject(result);
//         }
//       })
//       .catch((e: Error) => signal.aborted || setError(e))
//       .finally(() => signal.aborted || setBusy(false));

//     return () => abortController.abort();
//   }, []);

//   return { busy, responseProject, error };
// }
