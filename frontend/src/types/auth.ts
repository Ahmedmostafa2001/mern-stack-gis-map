export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export type RegisterFormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
};

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export interface UserProfileResponse {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}
