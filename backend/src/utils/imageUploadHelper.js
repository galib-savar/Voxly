import fs from "fs";
import path from "path";

/**
 * Converts file to buffer from either memory or disk storage
 * @param {Object} file - Multer file object
 * @returns {Buffer} File buffer
 * @throws {Error} If file cannot be read
 */
export const getFileBuffer = (file) => {
    if (!file) {
        throw new Error("File object is required");
    }

    // Prefer buffer (memory storage)
    if (file.buffer) {
        return file.buffer;
    }

    // Fall back to reading from disk
    if (file.path && fs.existsSync(file.path)) {
        return fs.readFileSync(file.path);
    }

    throw new Error("File buffer not available and disk file not found");
};

/**
 * Cleans up temporary file from disk
 * @param {string} filePath - Path to temporary file
 * @returns {void}
 */
export const cleanupTempFile = (filePath) => {
    if (!filePath) return;

    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.warn(`[ImageUploadHelper] Failed to cleanup temp file: ${filePath}`, error.message);
    }
};

/**
 * Uploads file to ImageKit service
 * @param {Object} imageKit - ImageKit instance
 * @param {Object} file - Multer file object
 * @param {string} fileName - Custom file name for upload
 * @param {string} folder - ImageKit folder path
 * @returns {Promise<Object>} ImageKit upload response
 * @throws {Error} If upload fails
 */
export const uploadToImageKit = async (imageKit, file, fileName, folder) => {
    if (!imageKit) {
        throw new Error("ImageKit instance is required");
    }
    if (!file) {
        throw new Error("File is required for upload");
    }
    if (!fileName || !folder) {
        throw new Error("fileName and folder are required");
    }

    const fileBuffer = getFileBuffer(file);
    const tempPath = file?.path;

    try {
        const uploadResponse = await imageKit.upload({
            file: fileBuffer,
            fileName,
            folder,
            useUniqueFileName: false,
        });

        return uploadResponse;
    } catch (error) {
        throw new Error(`ImageKit upload failed: ${error.message}`);
    } finally {
        cleanupTempFile(tempPath);
    }
};

/**
 * Extracts and validates image file name
 * @param {Object} file - Multer file object
 * @returns {string} Generated file name with timestamp
 */
export const generateImageFileName = (file) => {
    if (!file || !file.originalname) {
        throw new Error("File must have originalname property");
    }

    const sanitizedName = path.parse(file.originalname).name;
    return `${Date.now()}-${sanitizedName}${path.extname(file.originalname)}`;
};
