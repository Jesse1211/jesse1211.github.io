import axios from "axios";
import { Experience } from "../models/Categories";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  //   headers: {
  //     "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMjE2MzgzNiwianRpIjoiMmJmODE1NDktMDRmMi00NzExLWE2ZWYtNjc2NDZiYWUwMWUzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6bnVsbCwibmJmIjoxNzEyMTYzODM2LCJjc3JmIjoiZDM0ZDUzOGQtYjE4YS00YTZiLWFlMGYtOWFkZWExZjIyZjQyIiwiZXhwIjoxNzEyMTY0NzM2fQ.1W6zOnmbP8vZ6UhgzvIbvGFxG92llkMm5bcgPYWQVX4"
  //   },
});

export const experienceService = {
  async addExperience(
    experience: Experience,
    abortSignal?: AbortSignal,
  ): Promise<string> {
    const response = await client.post<string>(
      `add_experience`,
      {
        experience,
      },
      { signal: abortSignal },
    );
    return response.data;
  },
  async getExperience(
    experienceId: string,
    abortSignal?: AbortSignal,
  ): Promise<Experience> {
    const response = await client.get<Experience>(
      `get_experience/${experienceId}`,
      {
        signal: abortSignal,
      },
    );
    return response.data;
  },
  async getExperiences(abortSignal?: AbortSignal): Promise<Experience[]> {
    const response = await client.get<string>(`get_experiences`, {
      signal: abortSignal,
    });
    const data: Experience[] = JSON.parse(response.data);
    return data;
  },
  async updateExperience(
    experience: Experience,
    abortSignal?: AbortSignal,
  ): Promise<string> {
    const response = await client.post<string>(
      `update_experience`,
      { experience },
      { signal: abortSignal },
    );
    return response.data;
  },
  async deleteExperience(
    experienceId: string,
    abortSignal?: AbortSignal,
  ): Promise<string> {
    const response = await client.delete<string>(
      `delete_experience/${experienceId}`,
      { signal: abortSignal },
    );
    return response.data;
  },
  async deleteAllExperience(abortSignal?: AbortSignal): Promise<string> {
    const response = await client.delete<string>(`delete_experiences`, {
      signal: abortSignal,
    });
    return response.data;
  },
};
