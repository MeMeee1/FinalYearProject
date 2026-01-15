
import { Request, Response } from 'express';
import { uploadToCloudinary } from '../../services/imageService.js';

export async function uploadImage(req: Request, res: Response) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const folder = req.body.folder || 'ecommerce-uploads';
        const { secure_url, public_id } = await uploadToCloudinary(req.file.buffer, folder);

        res.json({
            url: secure_url,
            publicId: public_id,
            message: 'Image uploaded successfully',
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Failed to upload image' });
    }
}
