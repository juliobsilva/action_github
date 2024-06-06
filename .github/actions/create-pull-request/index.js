// .github/actions/create-pull-request/index.js
const core = require('@actions/core');
const exec = require('@actions/exec');

try {
  const githubToken = core.getInput('github-token');
  const branchName = core.getInput('branch-name');
  const prTitle = core.getInput('pr-title');
  const prBody = core.getInput('pr-body');

  // Login no GitHub CLI
  // Wrap the code in an async function
  async function run() {
    await exec.exec('echo', [githubToken, '|', 'gh', 'auth', 'login', '--with-token']);
    await exec.exec('git', ['checkout', '-b', branchName]);
  }

  // Call the function
  run().catch(console.error);
  // Criar e mudar para a nova branch
  await exec.exec('git', ['checkout', '-b', branchName]);

  // Adicionar um arquivo com run_id
  const runId = process.env.GITHUB_RUN_ID;
  const filename = `run-id-${runId}.txt`;
  await exec.exec('echo', [`run-id-${runId}`, '>>', filename]);

  // Adicionar e commitar o arquivo
  await exec.exec('git', ['add', filename]);
  await exec.exec('git', ['config', '--global', 'user.email', 'APIOPS-Extractor@noreply.com']);
  await exec.exec('git', ['config', '--global', 'user.name', 'APIOPS Extractor']);
  await exec.exec('git', ['commit', '-m', 'Add ' + filename]);

  // Push da nova branch
  await exec.exec('git', ['push', '--set-upstream', 'origin', branchName]);

  // Criar o Pull Request
  await exec.exec('gh', ['pr', 'create', '--title', prTitle, '--body', prBody, '--head', branchName]);

  core.setOutput('pr-url', `https://github.com/${process.env.GITHUB_REPOSITORY}/pull/${runId}`);
} catch (error) {
  core.setFailed(error.message);
}
