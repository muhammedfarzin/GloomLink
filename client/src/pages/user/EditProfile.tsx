import InputBox from "@/components/InputBox";
import ProfileImage from "@/components/ProfileImage";
import { useEffect, useRef, useState } from "react";
import {
  EditProfileFormType,
  validateEditProfileForm,
} from "./formValidations";
import DropDownBox from "@/components/DropDownBox";
import DatePicker from "react-datepicker";
import Button from "@/components/Button";
import { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import CropperDialogBox from "@/components/CropperDialogBox";
import apiClient from "@/apiClient";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/reducers/auth";

const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 5));

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [dob, setDob] = useState<Date>();
  const [gender, setGender] = useState<string>();
  const [image, setImage] = useState<File | string>();
  const [cropimage, setCropImage] = useState<string | ArrayBuffer | null>(null);
  const [authType, setAuthType] = useState<string>("email");
  const [formData, setFormData] = useState<EditProfileFormType>({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<ReactCropperElement>(null);

  useEffect(() => {
    setLoading("Loading...");
    apiClient
      .get("/profile/edit")
      .then((response) => {
        const { dob, gender, image, authType, ...userData } = response.data;
        setDob(dob);
        setGender(gender);
        setImage(image);
        setFormData({ ...formData, ...userData });
        setAuthType(authType);
      })
      .catch((error) => {
        toast({
          description:
            error.response.data.message ||
            error.message ||
            "Something went wrong",
          variant: "destructive",
        });
      })
      .finally(() => setLoading(null));
  }, []);

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      const selectedImage = e.target.files[0];

      if (selectedImage.type.split("/")[0] !== "image") {
        toast({
          description: "Please upload only images",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setCropImage(reader.result);
      };
      reader.readAsDataURL(selectedImage);
      const url = URL.createObjectURL(selectedImage);
      URL.revokeObjectURL(url);
    }
  };

  const handleCropDone = () => {
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      croppedCanvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "profile.jpg", {
            type: "image/jpg",
          });
          setImage(file);
        }
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading("Updating...");
      if (
        !validateEditProfileForm(formData, authType, (errMessage) => {
          throw new Error(errMessage);
        })
      ) {
        return;
      }

      const formDatas = new FormData();

      if (image instanceof File) formDatas.append("image", image);
      if (dob) formDatas.append("dob", dob.toString());
      if (gender) formDatas.append("gender", gender);

      for (const [key, value] of Object.entries(formData)) {
        formDatas.append(key, value);
      }

      const {
        data: { userData, tokens },
      } = await apiClient.put("/profile/edit", formDatas, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(setAuthUser({ userData, tokens }));
      navigate("/profile");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          description: error.response?.data?.message,
          variant: "destructive",
        });
      } else {
        toast({
          description: (error as Error).message || "Something went wrong",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="m-auto max-w-[704px]">
      <div className="m-2">
        <h1 className="text-lg font-bold mt-5 mb-2">Edit Profile</h1>
        <div className="flex flex-col items-center">
          <ProfileImage
            className="cursor-pointer w-3/4 !max-w-36"
            profileImage={
              image instanceof File ? URL.createObjectURL(image) : image
            }
            onClick={() => imageInputRef.current?.click()}
          />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleOnUpload}
            value={[]}
            hidden
          />

          <div className="w-full mt-4">
            <form
              method="post"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="w-full"
            >
              <InputBox
                value={formData.username}
                onChange={handleOnChange}
                name="username"
                placeholder="Username"
                type="text"
              />
              <div className="flex gap-2 w-full">
                <InputBox
                  value={formData.firstname}
                  onChange={handleOnChange}
                  name="firstname"
                  placeholder="First name"
                  type="text"
                />
                <InputBox
                  value={formData.lastname}
                  onChange={handleOnChange}
                  name="lastname"
                  placeholder="Last name"
                  type="text"
                />
              </div>
              <div className="flex gap-2">
                <InputBox
                  value={formData.email}
                  name="email"
                  placeholder="Email"
                  type="email"
                  disabled
                />
                <InputBox
                  value={formData.mobile}
                  name="mobile"
                  onChange={handleOnChange}
                  placeholder="Mobile"
                  type="number"
                />
              </div>

              <div className="flex gap-2">
                <DropDownBox
                  className="w-[calc(100%-1.5rem)]"
                  placeholder="Gender (Optional)"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="m">Male</option>
                  <option value="f">Female</option>
                </DropDownBox>

                <DatePicker
                  selected={dob}
                  onChange={(date) => date && setDob(date)}
                  placeholderText="Date of Birth"
                  maxDate={maxDate}
                  dateFormat="dd-MMM-yyyy"
                  wrapperClassName="input my-1"
                  className="bg-[#353535] text-white"
                  calendarClassName="!bg-[#353535]"
                  monthClassName={() => "text-[blue]"}
                  dayClassName={(date) =>
                    date < maxDate
                      ? "!text-white hover:!bg-[#585858]"
                      : "!text-white opacity-25"
                  }
                />
              </div>

              {authType === "email" ? (
                <>
                  <div className="flex gap-2">
                    <InputBox
                      value={formData.newPassword}
                      name="newPassword"
                      onChange={handleOnChange}
                      placeholder="New password"
                      type="password"
                    />
                    <InputBox
                      value={formData.confirmPassword}
                      name="confirmPassword"
                      onChange={handleOnChange}
                      placeholder="Confirm password"
                      type="password"
                    />
                  </div>

                  <InputBox
                    value={formData.password}
                    name="password"
                    onChange={handleOnChange}
                    placeholder="Current password"
                    type="password"
                  />
                </>
              ) : null}
              <div className="flex justify-end mt-1">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!!loading}
                >
                  {loading || "Update"}
                </Button>
              </div>
            </form>
          </div>
        </div>
        <CropperDialogBox
          cropperRef={cropperRef}
          cropImage={cropimage as string}
          title="Crop"
          show={!!cropimage}
          onClose={() => setCropImage(null)}
          onDone={handleCropDone}
        />
      </div>
    </div>
  );
};

export default EditProfile;
