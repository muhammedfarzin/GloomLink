import Button from "@/components/Button";
import InputBox from "@/components/InputBox";
import { useEffect, useState } from "react";
import { validateRequiredFields } from "./formValidations";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/apiClient";
import { useNavigate } from "react-router-dom";

interface SubscriptionFormType {
  amount: string;
  name: string;
  accNumber: string;
  ifsc: string;
}

const SubscriptionEnableForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState<SubscriptionFormType>({
    amount: "",
    name: "",
    accNumber: "",
    ifsc: "",
  });

  useEffect(() => {
    apiClient
      .get("/subscriptions/check-eligibility")
      .then((response) => {
        if (!response.data.isEligible)
          throw new Error("You are not eligible for this feature");
      })
      .catch((error) => {
        toast({
          description:
            error.response?.data?.message ||
            error.message ||
            "Something went wrong",
          variant: "destructive",
        });
        navigate("/profile");
      });
  }, []);

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      setLoading("Processing...");
      validateRequiredFields(formData, (errMessage) => {
        throw new Error(errMessage);
      });

      const response = await apiClient.post("/subscriptions/enable", formData);
      toast({
        description:
          response.data?.message || "Your request submitted successfully",
      });

      navigate("/profile");
    } catch (error: any) {
      toast({
        description:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong",
        variant: "destructive",
      });
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
            <InputBox
              placeholder="Amount"
              type="number"
              value={formData.amount}
              name="amount"
              onChange={handleOnChange}
            />
            <InputBox
              placeholder="Bank account holder name"
              type="text"
              value={formData.name}
              name="name"
              onChange={handleOnChange}
            />
            <InputBox
              placeholder="Bank account number"
              type="number"
              value={formData.accNumber}
              name="accNumber"
              onChange={handleOnChange}
            />
            <InputBox
              placeholder="Bank IFSC code"
              type="text"
              value={formData.ifsc}
              name="ifsc"
              onChange={handleOnChange}
            />

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
