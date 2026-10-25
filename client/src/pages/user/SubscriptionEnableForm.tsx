import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import { applyServerFormErrors, type FieldErrors } from "@/lib/formValidations";
import FieldError from "@/components/FieldError";
import { useToaster } from "@/hooks/useToaster";
import { apiClient } from "@/apiClient";

interface SubscriptionFormType {
  amount: string;
  name: string;
  accNumber: string;
  ifsc: string;
}

const SubscriptionEnableForm: React.FC = () => {
  const navigate = useNavigate();
  const { toastMessage, toastError } = useToaster();
  const [loading, setLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState<SubscriptionFormType>({
    amount: "",
    name: "",
    accNumber: "",
    ifsc: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    apiClient
      .get("/subscriptions/check-eligibility")
      .then((response) => {
        if (!response.data.isEligible)
          throw new Error("You are not eligible for this feature");
      })
      .catch((error) => {
        toastError(error.message);
        navigate("/profile");
      });
  }, []);

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((current) => ({ ...current, [e.target.name]: "" }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      setLoading("Processing...");
      const nextErrors: FieldErrors = {};
      for (const [field, value] of Object.entries(formData)) {
        if (!value.trim())
          nextErrors[field] =
            `${field === "accNumber" ? "Account number" : field === "ifsc" ? "IFSC code" : field[0].toUpperCase() + field.slice(1)} is required.`;
      }
      if (formData.amount && Number(formData.amount) <= 0)
        nextErrors.amount = "Amount must be greater than zero.";
      if (formData.accNumber && !/^\d{6,18}$/.test(formData.accNumber))
        nextErrors.accNumber = "Enter a valid account number.";
      if (formData.ifsc && !/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(formData.ifsc))
        nextErrors.ifsc = "Enter a valid IFSC code.";
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) return;

      const response = await apiClient.post("/subscriptions/enable", formData);
      toastMessage(
        response.data?.message || "Your request submitted successfully",
      );

      navigate("/profile");
    } catch (error: any) {
      const serverErrors = applyServerFormErrors(error);
      if (Object.keys(serverErrors).length) {
        setErrors((current) => ({ ...current, ...serverErrors }));
      } else toastError(error.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="m-auto max-w-[704px]">
      <div className="flex flex-col gap-10 justify-center m-2 min-h-screen">
        <div>
          <h2 className="capitalize text-lg font-bold">Enable Subscription</h2>
          <form
            className="bg-secondary border border-border rounded-xl mt-2 p-4"
            onSubmit={handleSubmit}
          >
            <input
              className="input-box"
              aria-invalid={!!errors.amount}
              placeholder="Amount"
              type="number"
              value={formData.amount}
              name="amount"
              onChange={handleOnChange}
            />
            <FieldError message={errors.amount} />
            <input
              className="input-box"
              aria-invalid={!!errors.name}
              placeholder="Bank account holder name"
              type="text"
              value={formData.name}
              name="name"
              onChange={handleOnChange}
            />
            <FieldError message={errors.name} />
            <input
              className="input-box"
              aria-invalid={!!errors.accNumber}
              placeholder="Bank account number"
              type="number"
              value={formData.accNumber}
              name="accNumber"
              onChange={handleOnChange}
            />
            <FieldError message={errors.accNumber} />
            <input
              className="input-box"
              aria-invalid={!!errors.ifsc}
              placeholder="Bank IFSC code"
              type="text"
              value={formData.ifsc}
              name="ifsc"
              onChange={handleOnChange}
            />
            <FieldError message={errors.ifsc} />

            <div className="flex justify-end mt-1">
              <Button className="px-4" type="submit" disabled={!!loading}>
                {loading || "Enable"}
              </Button>
            </div>
          </form>
        </div>

        <div>
          <div className="text-lg font-bold">
            Empower your creativity and earn income by offering subscriptions to
            your fans!
          </div>
          <p className="text-sm py-2">
            As a creator, you will benefit from:
            <ul className="list-disc pl-5">
              <li>
                <span className="font-bold">Monetization:</span> Generate a
                steady income by providing exclusive content to your subscribed
                users, helping you sustain and grow your creative work.
              </li>
              <li>
                <span className="font-bold">Engaged Community:</span> Build a
                loyal fan base by delivering unique content that keeps your
                audience coming back for more.
              </li>
            </ul>
          </p>
          <div className="text-base font-bold">
            Start your subscription journey today and connect with your
            supporters like never before!
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionEnableForm;
