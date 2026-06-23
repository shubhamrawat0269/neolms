import mongoose from "mongoose";
import enrollmentSchema from "../shemas/enrollment.schema.js";

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
