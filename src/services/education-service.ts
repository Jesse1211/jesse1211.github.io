import axios from "axios";
import { Education } from "../models/Categories";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  //   headers: {
  //     "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMjE2MzgzNiwianRpIjoiMmJmODE1NDktMDRmMi00NzExLWE2ZWYtNjc2NDZiYWUwMWUzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6bnVsbCwibmJmIjoxNzEyMTYzODM2LCJjc3JmIjoiZDM0ZDUzOGQtYjE4YS00YTZiLWFlMGYtOWFkZWExZjIyZjQyIiwiZXhwIjoxNzEyMTY0NzM2fQ.1W6zOnmbP8vZ6UhgzvIbvGFxG92llkMm5bcgPYWQVX4"
  //   },
});

export const educationService = {
  async addEducation(
    education: Education,
    abortSignal: AbortSignal,
  ): Promise<string> {
    const response = await client.post<string>(
      `add_education`,
      {
        education,
      },
      { signal: abortSignal },
    );
    return response.data;
  },
  async getEducation(
    educationId: string,
    abortSignal?: AbortSignal,
  ): Promise<Education> {
    const response = await client.get<Education>(
      `get_education/${educationId}`,
      {
        signal: abortSignal,
      },
    );
    return response.data;
  },
  async getEducations(abortSignal?: AbortSignal): Promise<Education[]> {
    const response = await client.get<string>(`get_educations`, {
      signal: abortSignal,
    });
    const data: Education[] = JSON.parse(response.data);
    return data;
  },
  async updateEducation(
    education: Education,
    abortSignal?: AbortSignal,
  ): Promise<string> {
    const response = await client.post<string>(
      `update_education`,
      { education },
      { signal: abortSignal },
    );
    return response.data;
  },
  async deleteEducation(
    educationId: string,
    abortSignal?: AbortSignal,
  ): Promise<string> {
    const response = await client.delete<string>(
      `delete_education/${educationId}`,
      { signal: abortSignal },
    );
    return response.data;
  },
  async deleteAllEducation(abortSignal?: AbortSignal): Promise<string> {
    const response = await client.delete<string>(`delete_educations`, {
      signal: abortSignal,
    });
    return response.data;
  },
};
