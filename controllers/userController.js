import createHttpError from 'http-errors';
import multer from 'multer';
import { uploadFile } from '../utils/drive.js';
import User from '../models/userModel.js';

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(createHttpError.NotAcceptable('Invalid image formate.'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const multerImageUploadMiddleware = upload.single('photo');

export const uploadProfilePhoho = async (req, res, next) => {
  try {
    const { imageUrl, id } = await uploadFile(req.file);

    const user = await User.findByIdAndUpdate(req.body.id, {
      photo: {
        id,
        imageUrl,
      },
    });

    res.status(201).json({
      errorInfo: {
        status: 'success',
        statusCode: '00',
      },
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};
