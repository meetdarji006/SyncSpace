import { Router, Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

router.post('/', upload.single('file'), async (req: MulterRequest, res: Response): Promise<any> => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Convert buffer to base64
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
            resource_type: 'auto',
            folder: 'syncspace_attachments'
        });

        res.json({
            url: result.secure_url,
            type: result.resource_type, // 'image', 'video', 'raw'
            format: result.format
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

export default router;
