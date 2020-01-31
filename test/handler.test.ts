import 'isomorphic-fetch';
import { handleRequest } from '../src/handler';

const baseUrl = 'https://api.boltin.me';

describe('handler unsupported methods', () => {
    const unsupportedMethods = [
        'HEAD',
        'PUT',
        'DELETE',
        'CONNECT',
        'OPTIONS',
        'TRACE',
        'PATCH',
    ];
    unsupportedMethods.forEach(method => {
        it(method, async () => {
            const result = await handleRequest(new Request(`/`, { method }));
            expect(result.status).toEqual(404);
        });
    });
});

describe('handler invalid paths', () => {
    ['/', '/invoice', '/inv'].forEach(path => {
        it('GET ' + path, async () => {
            const result = await handleRequest(
                new Request(`${baseUrl}${path}`, { method: 'GET' }),
            );
            expect(result.status).toEqual(404);
        });
    });
    ['/', '/publis', '/publish/a'].forEach(path => {
        it('POST ' + path, async () => {
            const result = await handleRequest(
                new Request(`${baseUrl}${path}`, { method: 'POST' }),
            );
            expect(result.status).toEqual(404);
        });
    });
});
