// Shared fake data source for the test-forms/* demo routes.
// Not a route itself (underscore-prefixed folder is excluded from routing).

export type Submission = { id: number; name: string; email: string; message: string };

const SUBMISSIONS: Submission[] = [];
let nextId = 1;

// Simulates network/DB latency so every pending state is actually visible.
function delay(ms = 1200) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getSubmissions(): Promise<Submission[]> {
  return SUBMISSIONS;
}

export async function saveSubmission(
  data: { name: string; email?: string; message?: string },
  ms = 1200,
): Promise<Submission> {
  await delay(ms);
  const submission: Submission = {
    id: nextId++,
    name: data.name,
    email: data.email ?? "",
    message: data.message ?? "",
  };
  SUBMISSIONS.push(submission);
  return submission;
}
