import { HttpError } from "../../infrastructure/errors/HttpError";

export function validateRequiredFields(datas: Object) {
  for (const [key, value] of Object.entries(datas)) {
    if (!value || (typeof value == "string" && !value.trim())) {
      const fieldName =
        key === "username"
          ? "Username"
          : key.replace(/(?=[A-Z])|(name)/, (match) => ` ${match}`).trim();
      throw new HttpError(400, `${capitalizeString(fieldName)} is required.`);
    }
  }
}

function capitalizeString(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
