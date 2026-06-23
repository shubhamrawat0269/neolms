import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    progress: {
      type: Map,
      of: Number,
      default: {},
    },
    completedLessons: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    paymentId: {
      type: String,
      required: [true, "Payment ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index to prevent duplicate enrollments
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// Index for student queries
enrollmentSchema.index({ student: 1, completed: 1 });

// Pre-save middleware to update completion percentage
enrollmentSchema.pre("save", function (next) {
  if (this.isModified("completedLessons") || this.isModified("progress")) {
    const totalLessons = this.course?.sections?.reduce(
      (acc, section) => acc + section.lessons.length,
      0,
    );

    if (totalLessons > 0) {
      this.completionPercentage =
        (this.completedLessons.length / totalLessons) * 100;
      this.completed = this.completionPercentage === 100;
    }
  }
  next();
});

export default enrollmentSchema;
