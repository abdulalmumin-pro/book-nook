import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const BookSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    description: { type: String, default: "" },
    totalCopies: { type: String, default: "1" },
    userName: { type: String, default: "" },
    userEmail: { type: String, default: "" },
  },
  { timestamps: true } // adds createdAt / updatedAt
);

export type BookDocument = InferSchemaType<typeof BookSchema>;

export const Book =
  (models.Book as Model<BookDocument> | undefined) ??
  model<BookDocument>("Book", BookSchema);
