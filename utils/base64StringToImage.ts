import * as fs from "fs";
import path from "path";


/**
 * Creates an image file from a binary string.
 *
 * @param binaryStr - The binary string representation of the image data. Ex. "9f463a4sd65as4..."
 * @returns A `File` object representing the image, with a `.png` extension and a MIME type of `image/png`.
 *
 * @remarks
 * - The function decodes the binary string using `atob`, converts it into a `Uint8Array`,
 *   and then creates a `Blob` object from the byte array.
 * - The resulting `File` object is named using the current timestamp to ensure uniqueness.
 */
export function createImageFromBinaryString(binaryStr: string): File {
  const mimeType = "image/png";
  const byteNumbers = atob(binaryStr).split("").map((c) => c.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  const file = new File([blob], `${Date.now()}.png`, { type: mimeType });
  return file;
}

/**
 * Downloads a file by saving it to the local filesystem.
 *
 * @param file - The `File` object to be downloaded and saved.
 * @returns A promise that resolves when the file is successfully saved.
 *
 * @remarks
 * - The function ensures the provided file exists before proceeding.
 * - Converts the `File` object to a `Buffer` for writing to the filesystem.
 * - Creates the output directory if it does not already exist.
 * - Saves the file in the `./images` directory (or the specified path).
 *
 * @example
 * ```typescript
 * const file = new File(["Hello, world!"], "example.txt", { type: "text/plain" });
 * await DownloadFile(file);
 * // Logs: "File saved at ./images/example.txt"
 * ```
 *
 * @throws Will log an error if no file is provided.
 */
export async function DownloadFile(file: File): Promise<void> {
  // Ensure the file exists
  if (!file) {
    console.error("No file provided");
    return;
  }

  // Convert the File object to a Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Create a directory if it doesn't exist
  const outputDir: string = "./images"; // Set your desired path
  await fs.promises.mkdir(outputDir, { recursive: true });

  // Get the full path to save the file
  const fullPath = path.join(outputDir, file.name);

  // Save the file to the filesystem
  await fs.promises.writeFile(fullPath, buffer);
  console.log(`File saved at ${fullPath}`);
}
