export const hexToBytes = (hex: string): Uint8Array | null => {
    hex = hex.length % 2 === 0 ? hex : `0${hex}`;

    if (!new RegExp(/^[0-9a-fA-F]+$/).test(hex)) return null;

    const match = hex.match(/.{1,2}/g);
    if (match) return new Uint8Array(match.map(byte => parseInt(byte, 16)));
    return null;
};

export const bytesToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

export const isBase64 = (s: string): boolean => {
    return new RegExp(/^[a-zA-Z0-9-_]+$/).test(s);
};

export const bytesToBase64 = (buffer: ArrayBuffer): string => {
    let bytes = new Uint8Array(buffer);
    let binary = '';
    for (var i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return uriSafe(btoa(binary));
};

const uriSafe = (s: string) =>
    s
        .replace('/', '_')
        .replace('+', '-')
        .replace('=', '');
