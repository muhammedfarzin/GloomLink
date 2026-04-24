import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DropDownBox from "@/components/DropDownBox";
import Button from "@/components/Button";
import TagInput from "@/components/TagInput";
import ImageListInputCard from "@/components/ImageListInputCard";
import { apiClient } from "@/apiClient";
import { useToaster } from "@/hooks/useToaster";
import type { RootState } from "@/redux/store";

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { toastError } = useToaster();
  const { postId } = useParams();
  const myUserId = useSelector(
    (state: RootState) => state.auth.userData?.userId,
  );

  const [caption, setCaption] = useState<string>("");
  const [images, setImages] = useState<(File | string)[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [publishedFor, setpublishedFor] = useState<string>("public");
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (postId) {
      apiClient
        .get(`/posts/${postId}`)
        .then((response) => {
          const { userId, images, caption, tags, publishedFor } =
            response.data.postData;
          if (userId !== myUserId) return navigate("/profile");

          setImages(images);
          setCaption(caption);
          setTags(tags);
          setpublishedFor(publishedFor);
        })
        .catch((error) => {
          toastError(error.message);
        });
    } else {
      setCaption("");
      setImages([]);
      setTags([]);
      setpublishedFor("public");
    }
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(postId ? "Updating..." : "Posting...");

    try {
      if (!images.length && !caption.trim()) {
        throw new Error("Please enter caption or upload images");
      }

      const formData = new FormData();
      images.forEach((image) => {
        if (image instanceof File) formData.append("images", image);
      });
      tags.forEach((tag) => {
        formData.append("tags", tag);
      });
      formData.append("caption", caption);
      formData.append("publishedFor", publishedFor);

      if (postId) {
        removedImages.forEach((image) => {
          formData.append("removedImages[]", image);
        });

        await apiClient.put(`/posts/edit/${postId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await apiClient.post("/posts/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      navigate("/profile");
    } catch (error: any) {
      toastError(error.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="mx-4 mt-4">
      <div className="border border-border bg-secondary rounded-lg md:rounded-2xl my-1 p-4">
        <form method="post" onSubmit={handleSubmit}>
          <ImageListInputCard
            values={images}
            onChange={setImages}
            onRemove={(image) => {
              if (typeof image === "string")
                setRemovedImages([...removedImages, image]);
            }}
          />
          <input
            className="input-box mt-2"
            placeholder="Write a caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <TagInput values={tags} onChange={setTags} />

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
              disabled={!!loading}
            >
              {loading || (postId ? "Update" : "Post")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
