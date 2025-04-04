// import { useEffect, useState } from "react";
// import { projectService } from "../services/project-service";
// import { Project } from "../models/Categories";
// import { RequestType } from "../models/User";

// export function useProject(
//   requestType: RequestType,
//   id?: string,
//   project?: Project,
// ): {
//   busy: boolean;
//   responseProject?: Project | Project[] | string;
//   error?: Error;
// } {
//   const [responseProject, setResponseProject] = useState<
//     Project | Project[] | string
//   >();
//   const [busy, setBusy] = useState<boolean>(true);
//   const [error, setError] = useState<Error>();

//   useEffect(() => {
//     const abortController = new AbortController();
//     const signal = abortController.signal;

//     switch (requestType) {
//       case "GETONE":
//         if (id !== undefined) {
//           projectService
//             .getProject(id)
//             .then((result) => {
//               if (!signal.aborted) {
//                 setResponseProject(result);
//               }
//             })
//             .catch((e: Error) => signal.aborted || setError(e))
//             .finally(() => signal.aborted || setBusy(false));
//         } else setResponseProject("No ID provided");
//         break;
//       case "GETALL":
//         projectService
//           .getProjects()
//           .then((result) => {
//             if (!signal.aborted) {
//               setResponseProject(result);
//             }
//           })
//           .catch((e: Error) => signal.aborted || setError(e))
//           .finally(() => signal.aborted || setBusy(false));
//         break;
//       case "UPDATE":
//         if (project !== undefined) {
//           projectService
//             .updateProject(project)
//             .then((result) => {
//               if (!signal.aborted) {
//                 setResponseProject(result);
//               }
//             })
//             .catch((e: Error) => signal.aborted || setError(e))
//             .finally(() => signal.aborted || setBusy(false));
//         } else setResponseProject("No data provided");
//         break;
//       case "DELETEONE":
//         if (id !== undefined) {
//           projectService
//             .deleteProject(id)
//             .then((result) => {
//               if (!signal.aborted) {
//                 setResponseProject(result);
//               }
//             })
//             .catch((e: Error) => signal.aborted || setError(e))
//             .finally(() => signal.aborted || setBusy(false));
//         }
//         break;
//       case "DELETEALL":
//         projectService
//           .deleteAllProject()
//           .then((result) => {
//             if (!signal.aborted) {
//               setResponseProject(result);
//             }
//           })
//           .catch((e: Error) => signal.aborted || setError(e))
//           .finally(() => signal.aborted || setBusy(false));
//         break;
//       default:
//         break;
//     }

//     return () => abortController.abort();
//   }, [id, project, requestType]);

//   return { busy, responseProject, error };
// }
