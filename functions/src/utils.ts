// import {
//   GetSecretValueCommand,
//   SecretsManagerClient,
// } from '@aws-sdk/client-secrets-manager';

// export const getSecretValue = async (secretName = 'SECRET_NAME') => {
//   const client = new SecretsManagerClient({ region: 'us-east-2' });
//   const response = await client.send(
//     new GetSecretValueCommand({
//       SecretId: secretName,
//     }),
//   );

//   if (response.SecretString) {
//     return response.SecretString;
//   }

//   return '';
// };
