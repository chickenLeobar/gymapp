export interface IoauthResponse {
  resp: boolean;
  errors?: { code: number; message: string }[];
  token?: string;
}
