import * as github from '@actions/github';

export async function checkPRDescription(client: github.GitHub, owner: string, repo: string, prNumber: number): Promise<boolean> {
  try {
    const response = await client.pulls.get({
      owner,
      repo,
      pull_number: prNumber
    });
    const description = response.data.body;
    return !!description.trim(); // Retorna verdadeiro se a descrição não estiver vazia
  } catch (error) {
    console.error(`Error checking PR description: ${error}`);
    return false;
  }
}
