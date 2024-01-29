import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { __dirname } from '../path.js';

const storage = multer.diskStorage({
    destination: function (_, file, cb) {
        let folder = '';

        switch (file.fieldname) {
            case 'profileImage':
                folder = 'profiles';
                break;
            case 'productImage':
                folder = 'products';
                break;
            case 'document':
                folder = 'documents';
                break;
            default:
                folder = 'others';
        }
        

        const destinationPath = path.join(__dirname, `/uploads/${folder}`);

        if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, { recursive: true });
        }

        cb(null, destinationPath);
    },
    filename: function (_, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

export default upload;
