import { auth } from '@/lib/auth';

const { GET, POST } = auth.toNextJsHandler();

export { GET, POST };