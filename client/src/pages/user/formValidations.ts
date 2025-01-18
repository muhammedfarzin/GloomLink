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

export type EditProfileFormType = { [key: string]: string } & SignUpFormType & {
    newPassword: string;
  };

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
  if (
    !validateRequiredFields(
      {
        firstname: formData.firstname,
        lastname: formData.lastname,
        username: formData.username,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      },
      errorCallback
    )
  ) {
    return false;
  }

  if (!mobileRegex.test(formData.mobile)) {
    errorCallback("Please enter a valid mobile number.");
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
  } else return false;
  return true;
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
  for (const [key, value] of Object.entries(datas)) {
    if (!value || (typeof value == "string" && !value.trim())) {
      const fieldName =
        key === "username"
          ? "Username"
          : key.replace(/(?=[A-Z])|(name)/, (match) => ` ${match}`).trim();
      errorCallback(`${capitalizeString(fieldName)} is required.`);
      return false;
    }
  }
  return true;
}

function capitalizeString(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
