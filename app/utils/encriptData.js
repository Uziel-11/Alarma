async function encryptData(data, key) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(key),
        { name: "AES-CBC" },
        false,
        ["encrypt"]
    );
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const encryptedData = await crypto.subtle.encrypt(
        { name: "AES-CBC", iv: iv },
        cryptoKey,
        encodedData
    );
    const encryptedDataArray = Array.from(new Uint8Array(encryptedData));
    const ivArray = Array.from(iv);
    return { encryptedData: encryptedDataArray, iv: ivArray };
}

async function decryptData(encryptedData, key, iv) {
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(key),
        { name: "AES-CBC" },
        false,
        ["decrypt"]
    );
    const decryptedData = await crypto.subtle.decrypt(
        { name: "AES-CBC", iv: new Uint8Array(iv) },
        cryptoKey,
        new Uint8Array(encryptedData)
    );
    return new TextDecoder().decode(decryptedData);
}


module.exports = {
    encryptData,
    decryptData
}
