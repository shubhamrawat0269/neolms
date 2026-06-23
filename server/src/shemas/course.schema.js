import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Lesson title is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  videoUrl: {
    type: String,
    required: [true, "Video URL is required"],
  },
  duration: {
    type: Number,
    default: 0,
  },
  isPreview: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Section title is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  lessons: [lessonSchema],
  order: {
    type: Number,
    default: 0,
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      minlength: [20, "Description must be at least 20 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    sections: [sectionSchema],
    whatYouWillLearn: [String],
    requirements: [String],
    isPublished: {
      type: Boolean,
      default: false,
    },
    enrolledStudents: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
courseSchema.index({ title: "text", description: "text" });
courseSchema.index({ category: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ price: 1 });

export default courseSchema;