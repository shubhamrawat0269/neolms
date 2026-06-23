import mongoose from "mongoose";
import userSchema from "../shemas/user.schema.js";

const User = mongoose.model("User", userSchema);

export default User;
