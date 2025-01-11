import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import InputBox from "../../components/InputBox";
import { useState } from "react";
import DropDownBox from "../../components/DropDownBox";
import Button from "../../components/Button";
import TagsInput from "./components/TagsInput";
import ImageInput from "./components/ImageInput";
import apiClient from "@/apiClient";
import { useNavigate } from "react-router-dom";

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);

  const [caption, setCaption] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [publishedFor, setpublishedFor] = useState<string>("public");
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("caption", caption);
    formData.append("tags", JSON.stringify(tags));
    formData.append("publishedFor", publishedFor);

    try {
      setLoading("Posting...");
      await apiClient.post("/posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/profile");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="mx-4 mt-4">
      <div
        className="border rounded-lg md:rounded-2xl my-1 p-4"
        style={{
          backgroundColor: colorTheme.secondary,
          borderColor: colorTheme.border,
        }}
      >
        <form method="post" onSubmit={handleSubmit}>
          <ImageInput values={images} onChange={setImages} />
          <InputBox
            className="mt-2"
            placeholder="Write a caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <TagsInput values={tags} onChange={setTags} />

          <div className="flex justify-between">
            <DropDownBox
              name="for"
              className="w-32"
              value={publishedFor}
              onChange={(e) => setpublishedFor(e.target.value)}
            >
              <option value="public">Public</option>
              <option value="subscriber">Subscriber</option>
            </DropDownBox>

            <Button
              className="border border-[#9ca3af33] font-bold w-32 my-1"
              type="submit"
              disabled={loading ? true : false}
            >
              {loading || "Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
