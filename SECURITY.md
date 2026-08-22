# Security Policy

## Supported Versions

Security fixes are provided for the current production release line.

| Version | Supported          |
| ------- | ------------------ |
| 5.4.x   | :white_check_mark: |
| < 5.4   | :x:                |

## System and Scope

`jz-portfolio` is a publicly accessible application consisting of:

- the Angular frontend under `src/`;
- the Firebase Functions and Express API under `functions/`;
- Firebase Authentication, App Check, and Secret Manager integrations;
- PostgreSQL access from the backend; and
- GitHub Actions and Firebase deployment configuration.

Production, deployed development, and publicly reachable preview environments
are in scope. Local and emulator-only behavior is reportable when the same code
or configuration can expose protected data, credentials, or deployed systems.

## Threat Model and Trust Boundaries

Treat browser clients, HTTP requests, route and query parameters, request
headers and bodies, external feed or link-preview content, and pull-request
content as untrusted.

Firebase ID tokens establish user identity only after server-side verification.
App Check is an application-attestation and abuse-reduction control; it is not
user authentication or authorization.

Frontend source, public assets, Firebase web configuration, and explicitly
browser-safe identifiers are public. Database credentials, service-account
credentials, CI/CD credentials, authentication tokens, and Secret Manager
values are protected assets.

Development and preview environments must not expose or gain unintended access
to production data, credentials, or deployment authority.

## Security Invariants

- Sensitive reads and state-changing operations require appropriate
  server-side authorization.
- Client-side route guards, user identifiers, or UI visibility are not security
  boundaries.
- App Check alone must not grant administrative or user-specific privileges.
- Production and development data and credentials remain isolated.
- Protected values must not appear in client bundles, HTTP responses, logs,
  error details, build artifacts, or preview deployments.
- Database operations use parameterized queries and least-privilege
  credentials.
- External URLs and responses are validated and bounded. Requests must not
  provide access to private networks, cloud metadata services, or unsupported
  URL schemes.
- Untrusted content is encoded or sanitized before rendering.
- Authentication, authorization, and environment-selection failures fail
  closed.
- Workflows that deploy or access credentials must not execute untrusted fork
  content. Same-repository preview workflows depend on branch write access
  remaining restricted to trusted maintainers.

## Reportable Findings and Severity Context

Reportable findings include realistic paths to:

- bypass authentication, authorization, or App Check enforcement;
- read or modify protected application or database data;
- expose credentials, tokens, Secret Manager values, or sensitive logs;
- cross production, development, or preview environment boundaries;
- perform SQL injection, server-side request forgery, cross-site scripting, or
  another injection attack;
- execute pull-request-controlled code with deployment credentials; or
- alter an unauthorized Firebase deployment.

Severity depends on demonstrated reachability, required privileges, affected
environment, data sensitivity, and impact. Production compromise, credential
exposure, or unauthorized deployment is more severe than an isolated
development-only issue.

A development or preview issue remains reportable when it is publicly
reachable, exposes protected assets, or provides a path to production.

## Out of Scope, Exclusions, and Accepted Risk

The following are not reportable without a demonstrated security impact:

- intentionally public portfolio content and public read-only data;
- Firebase web configuration and other identifiers explicitly intended for
  browser use;
- local or emulator-only behavior with no path to a deployed environment; and
- vulnerabilities solely within a third-party service or dependency when no
  repository-specific, reachable impact is shown.

These exclusions do not suppress findings caused by unsafe integration,
configuration, reachable dependency behavior, or misplaced trust in a public
identifier.

## Known Limitations and Compensating Controls

The application uses controls including Firebase Authentication, App Check,
Helmet, CORS configuration, rate limiting, environment-specific credentials,
and repository-origin checks for preview workflows.

Reviewers must verify these controls at each affected route and workflow. Their
presence does not prove authorization, secret isolation, or safe deployment.

## Reporting a Vulnerability

Please use
[GitHub private vulnerability reporting](https://github.com/Zwiqler94/jz-portfolio/security/advisories/new).
Do not disclose vulnerability details in a public issue.

Include:

- the affected URL, component, release, and environment;
- steps to reproduce the issue;
- the demonstrated or expected impact;
- any relevant logs or screenshots with sensitive values removed; and
- suggested remediation, if available.

You should receive an acknowledgement within five business days and an initial
assessment within ten business days. Accepted reports will receive status
updates at least every thirty days until remediation or coordinated disclosure.
If a report is declined, the response will explain why it does not meet this
policy's criteria.

Please avoid accessing data that does not belong to you, disrupting the
service, or retaining sensitive information. Stop testing and report the issue
immediately if sensitive data is encountered.
