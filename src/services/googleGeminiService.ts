import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import fs from "fs";
import os from "os";
import { promisify } from "util";
import { CustomError } from "@controllers/UploadController";

const API_KEY = process.env.GEMINI_API_KEY as string;

const fileManager = new GoogleAIFileManager(API_KEY);

const genAI = new GoogleGenerativeAI(API_KEY);

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

export const processImage = async (
  imageBase64: string
): Promise<{
  description: string;
}> => {
  const tempFilePath = path.join(os.tmpdir(), "tempImage.jpg");

  try {
    const base64Data = imageBase64.replace(/^data:image\/jpeg;base64,/, "");
    await writeFile(tempFilePath, base64Data, "base64");

    const uploadResult = await fileManager.uploadFile(tempFilePath, {
      mimeType: "image/jpeg",
      displayName: "Uploaded Image",
    });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      "Tell me about this image.",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const responseText = await result.response.text();

    return {
      description: responseText.trim(),
    };
  } catch (error) {
    const typedError = error as CustomError;
    console.error(
      "Error processing image with Google Gemini:",
      typedError.message
    );

    if (fs.existsSync(tempFilePath)) {
      await unlink(tempFilePath);
    }

    throw error;
  } finally {
    if (fs.existsSync(tempFilePath)) {
      await unlink(tempFilePath);
    }
  }
};
