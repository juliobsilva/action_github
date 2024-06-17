name: 'PR Description Check'
description: 'Checks if pull request has a description and adds a comment if not'
author: 'Your Name'
inputs:
  repo-token:
    description: 'Token for the GitHub repository'
    required: true
runs:
  using: 'node12'
  main: 'dist/main.js'
