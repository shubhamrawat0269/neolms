import mongoose from "mongoose";
import courseSchema from "../shemas/course.schema.js";

const Course = mongoose.model("Course", courseSchema);

export default Course;
