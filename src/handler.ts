import { getInvoice, postInvoice } from './api/Requests';
import Router from './router';

export async function handleRequest(request: Request): Promise<Response> {
    const r = new Router();

    r.get('.*/invoice/.*', () => getInvoice(request));
    r.post('.*/publish/?', () => postInvoice(request));

    return await r.route(request);
}
