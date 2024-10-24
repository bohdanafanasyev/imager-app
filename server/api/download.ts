import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { sendStream, defineEventHandler, createError } from 'h3';
import { IncomingMessage, ServerResponse } from 'http';

export default defineEventHandler(async (event) => {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const zipFilePath = path.join(process.cwd(), 'uploads.zip');

    // Create a file to stream archive data to
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level
    });

    // Listen for all archive data to be written
    await new Promise<void>((resolve, reject) => {
        output.on('close', resolve);
        archive.on('error', reject);
        archive.pipe(output);

        // Append files from uploads directory
        archive.directory(uploadsDir, false);
        archive.finalize();
    });

    // Check if the zip file exists
    if (!fs.existsSync(zipFilePath)) {
        throw createError({ statusCode: 404, message: 'File not found' });
    }

    // Get the file size
    const stats = fs.statSync(zipFilePath);
    const fileSize = stats.size;

    // Set headers
    const res = event.node.res as ServerResponse;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=uploads.zip');
    res.setHeader('Content-Length', fileSize);

    return sendStream(event, fs.createReadStream(zipFilePath));
});