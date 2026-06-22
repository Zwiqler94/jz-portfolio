import { existsSync, readFileSync } from 'node:fs';

const expectedApiVersion = 'api/v4';
const forbiddenApiVersion = 'api/v3';

const checks = [
  {
    file: 'functions/src/app.ts',
    mustContain: [`'/${expectedApiVersion}'`],
  },
  {
    file: 'functions/src/index.ts',
    mustContain: ['createAppV4()'],
    mustNotContain: ['createAppV3'],
  },
  {
    file: 'src/environments/environment.prod.ts',
    mustContain: [expectedApiVersion],
    mustNotContain: [forbiddenApiVersion],
  },
  {
    file: 'src/environments/environment.ts',
    mustContain: [expectedApiVersion],
    mustNotContain: [forbiddenApiVersion],
  },
  {
    file: 'src/environments/environment.test.ts',
    mustContain: [expectedApiVersion],
    mustNotContain: [forbiddenApiVersion],
  },
  {
    file: 'src/environments/environment.dev-local.ts',
    mustContain: [expectedApiVersion],
    mustNotContain: [forbiddenApiVersion],
  },
  {
    file: 'ngsw-config.json',
    mustContain: [expectedApiVersion],
    mustNotContain: [forbiddenApiVersion],
  },
  {
    file: 'functions/JAZWICKLER-JLZ-5.1.7-swagger.json',
    mustContain: [`"default": "${expectedApiVersion}"`],
    mustNotContain: [forbiddenApiVersion, '/secrets/{secretName}'],
  },
];

const failures = [];

for (const check of checks) {
  if (!existsSync(check.file)) {
    failures.push(`${check.file} does not exist`);
    continue;
  }

  const contents = readFileSync(check.file, 'utf8');
  for (const value of check.mustContain ?? []) {
    if (!contents.includes(value)) {
      failures.push(`${check.file} must contain ${value}`);
    }
  }
  for (const value of check.mustNotContain ?? []) {
    if (contents.includes(value)) {
      failures.push(`${check.file} must not contain ${value}`);
    }
  }
}

if (failures.length > 0) {
  console.error('API contract check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`API contract check passed for ${expectedApiVersion}.`);
