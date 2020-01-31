import 'isomorphic-fetch';
import * as crypto from 'isomorphic-webcrypto';

import * as Requests from '../../src/api/Requests';
import { isBase64 } from '../../src/api/Utils';

// Polyfill crypto
Object.defineProperty(global, 'crypto', {
    value: {
        subtle: {
            digest: (algo: string, arr: Uint8Array) =>
                crypto.subtle.digest(algo, arr),
        },
    },
});

const invoiceValid = `lnbc1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5\
rqwzqfqqqsyqcyq5rqwzqfqypqdpl2pkx2ctnv5sxxmmwwd5kgetjypeh2ursdae8g\
6twvus8g6rfwvs8qun0dfjkxaq8rkx3yf5tcsyz3d73gafnh3cax9rn449d9p5uxz9\
ezhhypd0elx87sjle52x86fux2ypatgddc6k63n7erqz25le42c4u4ecky03ylcqca784w`;

const invoiceInvalid = `lnbc1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5\
rqwzqfqqqsyqcyq5rqwzqfqypqdpl2pkx2ctnv5sxxmmwwd5kgetjypeh2ursdae8g\
6twvus8g6rfwvs8qun0dfjkxaq8rkx3yf5tcsyz3d73gafnh3cax9rn449d9p5uxz9\
ezhhypd0elx87sjle52x86fux2ypatgddc6k63n7erqz25le42c4u4ecky03ylcqca784`;

describe('getInvoice', () => {
    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('valid invoice', async () => {
        jest.spyOn(Requests, 'kvGet').mockReturnValue(
            new Promise(res => res(invoiceValid)),
        );
        const resp = await Requests.getInvoice(new Request('/Duq4aOG5'));
        const data = await resp.json();

        expect(data.complete).toBeTruthy();
        expect(data.invoice).toEqual(invoiceValid);
    });

    it('invalid invoice', async () => {
        jest.spyOn(Requests, 'kvGet').mockReturnValue(
            new Promise(res => res('')),
        );
        const resp = await Requests.getInvoice(new Request('/Duq4aOG5'));
        const data = await resp.json();

        expect(resp.status).toEqual(400);
        expect(data.error).toEqual('Invoice not found');
    });
});

describe('postInvoice', () => {
    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('valid invoice', async () => {
        jest.spyOn(Requests, 'kvPut').mockReturnValue(
            new Promise(res => res()),
        );

        jest.spyOn(Requests, 'kvGet').mockReturnValue(
            new Promise(res => res(invoiceValid)),
        );

        const resp = await Requests.postInvoice(
            new Request('/Duq4aOG5', {
                method: 'POST',
                body: JSON.stringify({ invoice: invoiceValid }),
            }),
        );

        const data = await resp.json();
        expect(isBase64(data.id)).toBeTruthy();
    });

    it('invalid invoice', async () => {
        jest.spyOn(Requests, 'kvPut').mockReturnValue(
            new Promise(res => res()),
        );
        jest.spyOn(Requests, 'kvGet').mockReturnValue(
            new Promise(res => res(invoiceInvalid)),
        );

        const resp = await Requests.postInvoice(
            new Request('/Duq4aOG5', {
                method: 'POST',
                body: JSON.stringify({ invoice: invoiceInvalid }),
            }),
        );

        const data = await resp.json();

        expect(resp.status).toEqual(400);
        expect(data.error).toEqual('Invalid invoice');
    });
});
