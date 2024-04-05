import axios from "axios";

const client = axios.create({
  baseURL: "http://127.0.0.1:5000",
//   headers: {
//     // https://developers.cloudflare.com/cloudflare-one/identity/service-tokens/#connect-your-service-to-access
//     "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMjE2MzgzNiwianRpIjoiMmJmODE1NDktMDRmMi00NzExLWE2ZWYtNjc2NDZiYWUwMWUzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6bnVsbCwibmJmIjoxNzEyMTYzODM2LCJjc3JmIjoiZDM0ZDUzOGQtYjE4YS00YTZiLWFlMGYtOWFkZWExZjIyZjQyIiwiZXhwIjoxNzEyMTY0NzM2fQ.1W6zOnmbP8vZ6UhgzvIbvGFxG92llkMm5bcgPYWQVX4"
//   },
});

export const projectService = {
  async addProject(
    abortSignal?: AbortSignal
  ) : Promise<string> {
    const response = await client.post<string>(
      `/add_project/`,
      {
        "Accomplishment": [
          "Developed a new algorithm"
        ],
        "Company": "Cornell University",
        "Description": "Work on various projects.",
        "EndDate": "20231231",
        "Expertise": [
          "Java",
          "Python"
        ],
        "StartDate": "20230101",
        "Title": "Software Engineer"
      },
      { signal: abortSignal }
    );
    console.log(response)
    return response.data;
  }
};
