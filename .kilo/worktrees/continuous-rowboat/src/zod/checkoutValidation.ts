export interface CheckoutFormErrors {
  name?: string;
  phone?: string;
  district?: string;
  upazila?: string;
  address?: string;
}

// ✅ BD phone format: 01XXXXXXXXX (11 digits, starts with 01)
const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;

export function validateField(
  field: keyof CheckoutFormErrors,
  value: string,
): string | undefined {
  switch (field) {
    case "name":
      if (!value.trim()) return "Full name is required";
      if (value.trim().length < 3) return "Name must be at least 3 characters";
      return undefined;

    case "phone":
      if (!value.trim()) return "Phone number is required";
      if (!BD_PHONE_REGEX.test(value.trim()))
        return "Enter a valid Bangladeshi number (e.g. 017XXXXXXXX)";
      return undefined;

    case "district":
      if (!value) return "Please select a district";
      return undefined;

    case "upazila":
      if (!value) return "Please select an upazila";
      return undefined;

    case "address":
      if (!value.trim()) return "Address is required";
      if (value.trim().length < 10)
        return "Please provide a more detailed address";
      return undefined;

    default:
      return undefined;
  }
}

export function validateAll(data: {
  name: string;
  phone: string;
  district: string;
  upazila: string;
  address: string;
}): CheckoutFormErrors {
  return {
    name: validateField("name", data.name),
    phone: validateField("phone", data.phone),
    district: validateField("district", data.district),
    upazila: validateField("upazila", data.upazila),
    address: validateField("address", data.address),
  };
}

export function isFormValid(errors: CheckoutFormErrors): boolean {
  return Object.values(errors).every((err) => !err);
}
