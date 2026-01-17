
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

/**
 * Upload a file buffer to Cloudinary
 * @param buffer - The file buffer to upload
 * @param folder - Optional folder name in Cloudinary
 * @returns Promise with valid Cloudinary upload result
 */
export const uploadToCloudinary = (buffer: Buffer, folder: string = 'dashboard-app'): Promise<{ secure_url: string; public_id: string }> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'auto' },
            (error, result) => {
                if (error) return reject(error);
                if (result) {
                    resolve({ secure_url: result.secure_url, public_id: result.public_id });
                } else {
                    reject(new Error('Failed to upload to Cloudinary: No result returned'));
                }
            }
        );

        Readable.from(buffer).pipe(stream);
    });
};
