import { Server } from 'socket.io';

declare global {
    namespace Express {
        interface Request {
            io: Server;
            userId?: number;
            role?: string;
            cleanBody?: any;
            rawBody?: any;
        }
    }
}
