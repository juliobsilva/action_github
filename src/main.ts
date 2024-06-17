import * as core from '@actions/core';
import * as github from '@actions/github';
import { checkPRDescription } from './utils';

async function run() {
  try {
    const token = core.getInput('repo-token', { required: true });
    const client = new github.GitHub(token);

    const prNumber = github.context.payload.pull_request?.number;
    if (!prNumber) {
      throw new Error('Could not determine pull request number.');
    }

    const isValidDescription = await checkPRDescription(client, github.context.repo.owner, github.context.repo.repo, prNumber);

    if (!isValidDescription) {
      const comment = `
        :warning: **Pull Request Description Missing** :warning:
        It looks like your pull request doesn't have a description. Please add a description that explains the changes being made.
        `;
      await client.issues.createComment({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: prNumber,
        body: comment
      });

      core.setFailed('Pull request description is missing.');
    } else {
      console.log('Pull request description is valid.');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
