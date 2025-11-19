import multer, { Options } from 'multer'; // 1. Importe 'Options'
import path from 'path';
import crypto from 'crypto';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const fileHash = crypto.randomBytes(16).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`;
        cb(null, fileName);
    }
});

export const uploadConfig: Options = { 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/webp'
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo inválido.'));
        }
    }
};