/* eslint-disable @typescript-eslint/naming-convention */
export type FacebookLoginStatus = 'connected' | 'not_authorized' | 'unknown';

export interface FacebookLoginResponse {
  status: FacebookLoginStatus;
  authResponse?: {
    accessToken: string;
    expiresIn: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    reauthorize_required_in: string;
    signedRequest: string;
    userID: string;
  };
}
