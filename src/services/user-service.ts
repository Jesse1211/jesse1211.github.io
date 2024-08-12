import axios from "axios";
import { User } from "../models/User";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  //   headers: {
  //     "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMjE2MzgzNiwianRpIjoiMmJmODE1NDktMDRmMi00NzExLWE2ZWYtNjc2NDZiYWUwMWUzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6bnVsbCwibmJmIjoxNzEyMTYzODM2LCJjc3JmIjoiZDM0ZDUzOGQtYjE4YS00YTZiLWFlMGYtOWFkZWExZjIyZjQyIiwiZXhwIjoxNzEyMTY0NzM2fQ.1W6zOnmbP8vZ6UhgzvIbvGFxG92llkMm5bcgPYWQVX4"
  //   },
});

export const userService = {
  async login(user: User, abortSignal?: AbortSignal): Promise<string> {
    const response = await client.post<string>(
      `login`,
      { user },
      { signal: abortSignal },
    );
    console.log(response);
    return response.data;
  },
  async register(user: User, abortSignal?: AbortSignal): Promise<string> {
    const response = await client.post<string>(
      `register`,
      { user },
      { signal: abortSignal },
    );
    console.log(response);
    return response.data;
  },
};
