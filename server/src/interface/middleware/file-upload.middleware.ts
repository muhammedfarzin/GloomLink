import path from "path";
import multer from "multer";

export const uploadImage = multer({
  storage: multer.diskStorage({
    destination: path.join("public", "images"),
    filename: (req, file, cb) => {
      const randomNumber = Math.floor(Math.random() * 90000) + 10000;
      cb(
        null,
        `${Date.now()}${randomNumber}-${file.originalname.replace(" ", "-")}`
      );
    },
  }),
});
