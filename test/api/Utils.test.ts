import { bytesToHex, hexToBytes, isBase64 } from '../../src/api/Utils';

describe('Utils', () => {
    it('hexToBytes valid', () => {
        const hex = '03e7156ae33b0a208d07441';
        const byteArr = [0, 62, 113, 86, 174, 51, 176, 162, 8, 208, 116, 65];

        expect(hexToBytes(hex)).toEqual(new Uint8Array(byteArr));
    });

    it('hexToBytes invalid', () => {
        const hex = 'g03e7156ae33b';
        expect(hexToBytes(hex)).toBeNull();
    });

    it('bytesToHex', () => {
        const hex = '99de38e98a39d6a569434e1845';
        const bytes = hexToBytes(hex);
        expect(bytes).toBeTruthy();
        expect(bytesToHex(bytes as Uint8Array)).toEqual(hex);
    });

    it('isBase64 valid', () => {
        const base64strs = [
            'Duq4aOG5',
            'eWVldA',
            'Z2VuZXNpc2Jsb2Nr',
            'Y2xvdWRmbGFyZQ',
        ];
        base64strs.forEach(str => {
            expect(isBase64(str)).toBeTruthy();
        });
    });

    it('isBase64 invalid', () => {
        const base64strs = ['ZmxqZGh3aGVrZmh3a2xoZjs+', 'Y2xvdWRmbGFyZQ=='];
        base64strs.forEach(str => {
            expect(isBase64(str)).toBeFalsy();
        });
    });
});
