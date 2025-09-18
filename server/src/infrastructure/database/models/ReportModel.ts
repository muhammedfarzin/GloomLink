import { type Document, model, Schema } from "mongoose";
import { PostModel } from "./PostModel";
import { UserModel } from "./UserModel";

interface ReportType {
  _id: Schema.Types.ObjectId;
  type: "post" | "user";
  targetId: Schema.Types.ObjectId;
  reportedBy: Schema.Types.ObjectId;
}

export type ReportDocument = ReportType & Document;

const ReportSchema = new Schema<ReportType>(
  {
    type: {
      type: String,
      enum: ["post", "user"],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ReportSchema.post("save", async function () {
  const reportCount = await ReportModel.countDocuments({
    targetId: this.targetId,
  });

  if (reportCount >= 5) {
    if (this.type === "post") {
      await PostModel.findByIdAndUpdate(this.targetId, { status: "deleted" });
    } else if (this.type === "user") {
      await UserModel.findByIdAndUpdate(this.targetId, { status: "blocked" });
    }
    await ReportModel.deleteMany({ targetId: this.targetId });
  }
});

export const ReportModel = model("Report", ReportSchema, "reports");
