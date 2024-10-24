import { IncomingMessage } from 'http'

interface File {
    path: string;
    originalname: string;
}

interface RequestWithFiles extends IncomingMessage {
    files?: File[];
}