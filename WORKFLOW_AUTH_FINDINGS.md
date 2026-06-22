# Workflow Authentication Findings

Date checked: 2026-06-22

## Purpose

This note summarizes the current authentication findings for the
release/version workflows in this repository.

The main question is whether `version-release` still needs a user OAuth token
or per-run secret rotation.

## Current Workflow Context

The release workflow in `.github/workflows/version.yml` needs GitHub
authentication for these operations:

- checking out and fetching the repository
- pushing the version commit back to the release branch
- pushing the release tag
- creating the release pull request
- merging the release pull request

The only current same-run use for a user token is the auto-approval step:

```yaml
- name: request APPROVAL
  run: >
    curl --request POST "$APPROVAL_URL"
    -H 'Authorization:Bearer ${{ steps.releaseTokens.outputs.userToken }}'
    -d '{"event":"APPROVE"}'
```

## Finding 1: An App Installation Token Can Create PR Reviews

GitHub's pull request review API supports GitHub App installation access tokens
for creating a pull request review. The endpoint requires
`Pull requests: write`, and the `event` body can be `APPROVE`,
`REQUEST_CHANGES`, or `COMMENT`.

Source: [GitHub REST API - Create a review for a pull request][pr-review-api]

Implication: a user OAuth token is not categorically required just to call the
PR review API. An app installation token can do it if the app has the right
repository permission.

## Finding 2: The Current Repo Rules Do Not Require PR Approval

The repository default branch is currently `development`.

The active ruleset named `development` targets `~DEFAULT_BRANCH` and contains
these rules:

- deletion protection
- non-fast-forward protection
- CodeQL code scanning requirement
- required status check: `deployDev / check-deploy-job`

It does not contain a required pull request review rule.

Classic branch protection for `development` returned `Branch not protected`.

Implication: under the currently verified repo rules, the release workflow does
not need to submit an approval at all before merging, assuming the required
status check passes.

## Finding 3: User OAuth Is Only Needed For User Attribution Or Human-Like Policy

GitHub App installation authentication is intended for automation that does not
involve user input. GitHub App user access tokens are for actions that should
be attributed to a specific user or constrained to what that user could do.

Source: [GitHub App authentication overview][app-auth-overview]

Implication: `version-release` should prefer app installation authentication
unless the repository intentionally adds a policy that requires a distinct
trusted user approval.

## Finding 4: Same-Run Secret Rotation Is Not Needed For Installation Tokens

GitHub App installation access tokens are minted on demand and expire after
1 hour. They should be generated during the workflow run and used directly for
that run.

Source: [Generating an installation access token for a GitHub App][app-token]

Implication: storing freshly minted installation tokens back into GitHub
Secrets is unnecessary for this release workflow. It also creates stale-token
failure modes because secrets updated during one run are mainly useful to
future runs, not the current job.

## Recommended Auth Contract

For the current repository rules, `version-release` should only need a fresh
GitHub App installation token with enough permissions for release automation:

- `contents: write` for checkout, version commit push, and tag push
- `pull_requests: write` for creating and merging the release PR
- any additional permission required by the merge endpoint or future rules

The workflow should not need:

- `USER_ACCESS_TOKEN`
- `USER_REFRESH_TOKEN`
- `clientId` or `clientSecret` for user OAuth
- a PR approval step
- per-run rotation of `APP_ACCESS_TOKEN` into repository secrets

The long-lived secrets that remain necessary are the credentials required to
mint an installation token:

- `APP_ID`
- `APP_PRIVATE_KEY`
- installation or repository targeting inputs, if the token action needs them

These should be treated as normal long-lived secrets and rotated periodically
or after suspected exposure, not rewritten every run.

## Caveat

If a future ruleset adds required approving reviews, the decision changes.
An app token can call the approval API, but an approval from the same app that
created or pushed the release PR may not satisfy a policy that requires a
distinct reviewer or human approval.

In that case, use either a distinct trusted GitHub App or a user token,
depending on the exact rule.

[app-auth-overview]: https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/about-authentication-with-a-github-app
[app-token]: https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app
[pr-review-api]: https://docs.github.com/en/rest/pulls/reviews?apiVersion=2022-11-28#create-a-review-for-a-pull-request
