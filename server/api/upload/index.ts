import multer, { MulterError } from 'multer';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { ServerResponse } from 'http';
import { defineEventHandler, createError } from 'h3';
import { IMAGE_TYPES } from '~/values'
import { getHeicImagePayload } from './utils';

const upload = multer({ dest: 'server/uploads/temporary' });


const createUserFolder = async (userId: string) => {
    const userFolder = path.join('uploads', userId);

    try {
        await fs.mkdir(userFolder, { recursive: true });
    } catch (err) {
        throw createError({ statusCode: 500, message: 'Failed to create user directory' });
    }

    return userFolder;
}

export default defineEventHandler(async (event) => {
    const req = event.node.req as RequestWithFiles;
    const res = event.node.res as ServerResponse;
    const { authorization: userId } = req.headers;

    if (!userId) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        });
    }

    // Use multer to handle file upload
    await new Promise<void>((resolve, reject) => {
        upload.array('files')(req, res, (err: MulterError | null) => {
            if (err) return reject(err);
            resolve();
        });
    });

    const files = req.files;

    if (!files || files.length === 0) {
        throw createError({
            statusCode: 400,
            message: 'No files uploaded'
        });
    }

    const userFolder = await createUserFolder(userId);

    const results: { originalName: string; fileName: string }[] = [];

    for (const file of files) {
        const filePath = file.path;
        const fileName = file.originalname;
        const imageFormat = 'avif';
        const outputFilePath = path.join(userFolder, `${fileName}.${imageFormat}`);

        try {
            let payload = {
                data: await fs.readFile(filePath),
                options: {},
            }

            if (file.mimetype === IMAGE_TYPES.heic) {
                payload = await getHeicImagePayload(payload.data);
            }

            await sharp(payload.data, payload.options)
                .avif({
                    lossless: false,
                    quality: 100,
                    effort: 0,
                })
                .toFile(outputFilePath);

            // Remove the original file
            await fs.unlink(filePath);

            results.push({ fileName: file.originalname });
        } catch (error) {
            throw createError({
                statusCode: 500,
                message: `Failed to process file ${fileName}: ${error.message}`
            });
        }
    }

    return { message: 'Files uploaded and converted successfully', files: results, success: true };
});