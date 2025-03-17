export interface ResetPasswordRequest {
  id: string;
  email: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ResetPasswordFormValues {
  email: string;
  confirmPassword: string;
  newPassword: string;
}
