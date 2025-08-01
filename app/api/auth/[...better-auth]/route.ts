import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth';

const { GET, POST } = toNextJsHandler(auth);

export { GET, POST };