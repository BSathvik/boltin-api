import bolt11 = require('bolt11');

import { isBase64, hexToBytes, bytesToBase64 } from './Utils';

export const kvGet = async (id: string): Promise<string | null> => {
    return await INVOICES.get(id, 'text');
};

export const kvPut = async (id: string, invoice: string) => {
    await INVOICES.put(id, invoice);
};

const MAX_POLLS = 5;
const ID_BYTE_LEN = 6;

export const postInvoice = async (request: Request): Promise<Response> => {
    const data = await request.json();
    const invoice = data.invoice;

    const invalidInvoice = () =>
        jsonResponse({ error: 'Invalid invoice' }, 400);
    let invoice_data = null;
    try {
        // Verify signature
        invoice_data = bolt11.decode(invoice);
    } catch (e) {
        return invalidInvoice();
    }

    const sigBuffer = hexToBytes(invoice_data.signature as string);
    if (!sigBuffer) return invalidInvoice();

    let pre_image = sigBuffer.buffer;

    // poll kv upto MAX_POLLS times to insert invoice
    for (let i = 0; i < MAX_POLLS; i++) {
        const cipher = await crypto.subtle.digest('SHA-256', pre_image);
        const id = bytesToBase64(cipher.slice(0, ID_BYTE_LEN));

        const value = await kvGet(id);
        // if the same invoice already exists
        if (value === invoice) return jsonResponse({ id });

        // if value is null/undefined/len is 0
        if (!value) {
            await kvPut(id, invoice);
            return jsonResponse({ id });
        }
        pre_image = cipher;
    }

    return invalidInvoice();
};

export const getInvoice = async (request: Request): Promise<Response> => {
    const invalidId = () => jsonResponse({ error: 'Invoice not found' }, 400);
    const id = request.url.split('/').pop();

    const bytesInB64 = (b: string) => 3 * (b.length / 4);
    if (!id || bytesInB64(id) > ID_BYTE_LEN || !isBase64(id)) {
        return invalidId();
    }

    const invoice = await kvGet(id);
    if (!invoice) {
        return invalidId();
    }

    try {
        const invoice_data = bolt11.decode(invoice) as any;
        delete invoice_data['paymentRequest'];
        invoice_data['invoice'] = invoice;
        return jsonResponse(invoice_data);
    } catch {
        return invalidId();
    }
};

const jsonResponse = (data: object, status: number = 200): Response => {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    });
};
