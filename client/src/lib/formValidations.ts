export type FieldErrors = Record<string, string>;

export interface LoginFormType {
  username: string;
  password: string;
}

export interface SignUpFormType {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  gender?: "f" | "m";
  dob?: Date;
}

interface ForgotPasswordField {
  identifier: string;
}

interface ResetPasswordField {
  identifier: string;
  otp: string;
  password: string;
}

export type EditProfileFormType = { [key: string]: string } & SignUpFormType & {
    newPassword: string;
  };

const passwordPattern =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const otpPattern = /^\d{6}$/;
const passwordError =
  "Password must be at least 8 characters long and include at least one letter, one number, and one special character.";

const validatePassword = (password: string): string | undefined =>
  password && !passwordPattern.test(password.trim())
    ? passwordError
    : undefined;

export const getRequiredFieldErrors = (
  fields: Record<string, string>,
): FieldErrors => {
  const labels: Record<string, string> = {
    firstname: "First name",
    lastname: "Last name",
    username: "Username",
    email: "Email",
    mobile: "Mobile number",
    password: "Password",
    confirmPassword: "Confirm password",
    newPassword: "New password",
    identifier: "Email, username, or phone number",
    otp: "OTP",
    amount: "Amount",
    name: "Account holder name",
    accNumber: "Account number",
    ifsc: "IFSC code",
  };

  return Object.fromEntries(
    Object.entries(fields)
      .filter(([, value]) => !value.trim())
      .map(([field]) => [field, `${labels[field] ?? field} is required.`]),
  );
};

export const validateLoginFields = (form: LoginFormType): FieldErrors => {
  return getRequiredFieldErrors({
    username: form.username,
    password: form.password,
  });
};

export const validateSignUpFields = (form: SignUpFormType): FieldErrors => {
  const errors = getRequiredFieldErrors({
    firstname: form.firstname,
    lastname: form.lastname,
    username: form.username,
    email: form.email,
    mobile: form.mobile,
    password: form.password,
    confirmPassword: form.confirmPassword,
  });
  if (
    form.password &&
    form.confirmPassword &&
    form.password !== form.confirmPassword
  ) {
    errors.confirmPassword = "Passwords do not match.";
  }
  const passwordValidationError = validatePassword(form.password);
  if (passwordValidationError) errors.password = passwordValidationError;
  return errors;
};

export const validateEditProfileFields = (
  form: EditProfileFormType,
  authType: string,
): FieldErrors => {
  const errors = getRequiredFieldErrors({
    firstname: form.firstname,
    lastname: form.lastname,
    username: form.username,
    mobile: form.mobile,
    ...(authType === "email" ? { password: form.password } : {}),
  });
  if (form.newPassword && form.newPassword !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }
  const passwordValidationError = validatePassword(form.newPassword);
  if (passwordValidationError) errors.newPassword = passwordValidationError;
  return errors;
};

export const validateOtpFields = (otp: string): FieldErrors =>
  otpPattern.test(otp) ? {} : { otp: "Enter a valid 6-digit OTP." };

export const validateForgotPwdFields = (
  form: ForgotPasswordField,
): FieldErrors => getRequiredFieldErrors({ identifier: form.identifier });

export const validateResetPwdField = (
  form: ResetPasswordField,
): FieldErrors => {
  const errors = getRequiredFieldErrors({
    identifier: form.identifier,
    otp: form.otp,
    password: form.password,
  });
  const passwordValidationError = validatePassword(form.password);
  if (passwordValidationError) {
    errors.password = passwordValidationError;
  }
  if (form.otp && !otpPattern.test(form.otp)) {
    errors.otp = "Enter a valid 6-digit OTP.";
  }
  return errors;
};

export const validateForgotFields = (
  identifier: string,
  requested: boolean,
  otp: string,
  password: string,
): FieldErrors =>
  requested
    ? validateResetPwdField({ identifier, otp, password })
    : validateForgotPwdFields({ identifier });

/** Apply the server's standard { errors: { field: message } } response. */
export const applyServerFormErrors = (error: unknown): FieldErrors => {
  const errors = (error as any)?.response?.data?.errors;
  if (!errors || typeof errors !== "object" || Array.isArray(errors)) return {};

  const fieldErrors = Object.fromEntries(
    Object.entries(errors).filter(
      ([, message]) => typeof message === "string" && message.trim().length > 0,
    ),
  ) as FieldErrors;
  return fieldErrors;
};
