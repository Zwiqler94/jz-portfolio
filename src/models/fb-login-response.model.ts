export interface FacebookLoginResponse {
  status: string;
  authResponse?: {
    accessToken: string;
    expiresIn: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    reauthorize_required_in: string;
    signedRequest: string;
    userID: string;
  };
}
