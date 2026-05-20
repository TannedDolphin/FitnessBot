import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../src/models/user.model.js";

dotenv.config({ path: "./.env" });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not configured. Set it in fitness-backend/.env.");
  process.exit(1);
}

const connect = async () => {
  await mongoose.connect(MONGO_URI, { family: 4 });
};

const fixUsernameIndex = async () => {
  const users = await User.find({
    $or: [
      { username: { $exists: false } },
      { username: null },
      { username: "" },
    ],
  }).lean();

  if (users.length === 0) {
    console.log("No users with missing username found.");
    return;
  }

  console.log(`Found ${users.length} user(s) missing username. Updating to use email values...`);

  for (const user of users) {
    if (!user.email) {
      console.warn(`Skipping user ${user._id} because email is missing.`);
      continue;
    }

    const username = user.email.trim().toLowerCase();
    await User.updateOne(
      { _id: user._id },
      { $set: { username } },
    );
  }

  console.log("Updated missing username fields. Syncing indexes...");
  await User.syncIndexes();
  console.log("Username index migration complete.");
};

const run = async () => {
  try {
    await connect();
    await fixUsernameIndex();
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

run();
