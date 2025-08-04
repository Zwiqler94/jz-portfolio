import { CredlyCredential } from 'src/app/interfaces/credentials/credly/credly.interface';
import { Achievement } from 'src/app/interfaces/credentials/microsoft/microsoft.interface';

export interface LearningCredential {
  credentialMsft: Achievement | undefined;
  credentialCredly: CredlyCredential | undefined;
  type: 'MSFT' | 'CRDLY';
}
