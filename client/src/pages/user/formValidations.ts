type ErrorCallbackType = (message: string) => void;

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

const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const mobileRegex = /^[6-9]\d{9}$/;

export type EditProfileFormType = SignUpFormType & { newPassword: string };

export const validateLoginForm = (
  formData: LoginFormType,
  errorCallback: ErrorCallbackType
): boolean => {
  if (!formData.username || !formData.password) {
    errorCallback("Please enter username and password");
    return false;
  }
  return true;
};

export const validateSignUpForm = (
  formData: SignUpFormType,
  errorCallback: ErrorCallbackType
): boolean => {
  if (!formData.firstname) {
    errorCallback("First name is required.");
    return false;
  }

  if (!formData.lastname) {
    errorCallback("Last name is required.");
    return false;
  }

  if (!formData.username) {
    errorCallback("Username is required.");
    return false;
  }

  if (!formData.email) {
    errorCallback("Email is required.");
    return false;
  }

  if (!formData.mobile) {
    errorCallback("Mobile number is required.");
    return false;
  }

  if (!formData.password) {
    errorCallback("Password is required.");
    return false;
  }

  if (!formData.confirmPassword) {
    errorCallback("Confirm password is required.");
    return false;
  }

  if (
    !formData.firstname ||
    !formData.lastname ||
    !formData.username ||
    !formData.email ||
    !formData.password ||
    !formData.confirmPassword
  ) {
    errorCallback("All fields are required.");
    return false;
  }

  if (!mobileRegex.test(formData.mobile)) {
    errorCallback("Mobile number is invalid.");
    return false;
  }

  if (!passwordRegex.test(formData.password)) {
    errorCallback(
      "Password must be at least 8 characters long and include at least one letter, one number, and one special character."
    );
    return false;
  }

  if (formData.password !== formData.confirmPassword) {
    errorCallback("Passwords do not match.");
    return false;
  }
  return true;
};

export const validateEditProfileForm = (
  formData: EditProfileFormType,
  errorCallback: ErrorCallbackType
) => {
  const { confirmPassword, newPassword, gender, dob, ...requiredField } =
    formData;
  if (validateRequiredFields(requiredField, errorCallback)) {
    if (gender && gender !== "f" && gender !== "m") {
      errorCallback("Invalid gender selected");
      return false;
    }

    if (newPassword) {
      if (!passwordRegex.test(newPassword)) {
        errorCallback(
          "Password must be at least 8 characters long and include at least one letter, one number, and one special character."
        );
        return false;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        errorCallback("Passwords do not match.");
        return false;
      }
    }
  }
  return false;
};

export const validateOtpForm = (
  otp: string,
  errorCallback: ErrorCallbackType
): boolean => {
  if (!/^\d{6}$/.test(otp)) {
    errorCallback("Please enter valid OTP");
    return false;
  }
  return true;
};

function validateRequiredFields(
  datas: Record<string, any>,
  errorCallback: ErrorCallbackType
) {
  for (const field in datas) {
    const fieldNameArr = field.split(/(?=[A-Z])/);
    const fieldName = fieldNameArr
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
    errorCallback(`${fieldName} is required.`);
    return false;
  }
  return true;
}
