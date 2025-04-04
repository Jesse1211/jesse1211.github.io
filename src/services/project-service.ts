// import axios from "axios";
// import { Project } from "../models/Categories";

// const client = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   //   headers: {
//   //     "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMjE2MzgzNiwianRpIjoiMmJmODE1NDktMDRmMi00NzExLWE2ZWYtNjc2NDZiYWUwMWUzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6bnVsbCwibmJmIjoxNzEyMTYzODM2LCJjc3JmIjoiZDM0ZDUzOGQtYjE4YS00YTZiLWFlMGYtOWFkZWExZjIyZjQyIiwiZXhwIjoxNzEyMTY0NzM2fQ.1W6zOnmbP8vZ6UhgzvIbvGFxG92llkMm5bcgPYWQVX4"
//   //   },
// });

// export const projectService = {
//   async addProject(
//     project: Project,
//     abortSignal?: AbortSignal,
//   ): Promise<string> {
//     const response = await client.post<string>(
//       `add_project`,
//       {
//         project,
//       },
//       { signal: abortSignal },
//     );
//     return response.data;
//   },
//   async getProject(
//     projectId: string,
//     abortSignal?: AbortSignal,
//   ): Promise<Project> {
//     const response = await client.get<Project>(`get_project/${projectId}`, {
//       signal: abortSignal,
//     });
//     return response.data;
//   },
//   async getProjects(abortSignal?: AbortSignal): Promise<Project[]> {
//     const response = await client.get<string>(`get_projects`, {
//       signal: abortSignal,
//     });
//     const data: Project[] = JSON.parse(response.data);
//     return data;
//   },
//   async updateProject(
//     project: Project,
//     abortSignal?: AbortSignal,
//   ): Promise<string> {
//     const response = await client.post<string>(
//       `update_project`,
//       { project },
//       { signal: abortSignal },
//     );
//     return response.data;
//   },
//   async deleteProject(
//     projectId: string,
//     abortSignal?: AbortSignal,
//   ): Promise<string> {
//     const response = await client.delete<string>(
//       `delete_project/${projectId}`,
//       { signal: abortSignal },
//     );
//     return response.data;
//   },
//   async deleteAllProject(abortSignal?: AbortSignal): Promise<string> {
//     const response = await client.delete<string>(`delete_projects`, {
//       signal: abortSignal,
//     });
//     return response.data;
//   },
// };
