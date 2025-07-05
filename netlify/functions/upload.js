const FormData = require("form-data");
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));

// PINATA_JWT env var should be set in Netlify : "Bearer <token>"
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { fileName, mimeType, data, doctorId, username } = JSON.parse(event.body || "{}");
    if (!fileName || !data) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing file" }) };
    }
    const buffer = Buffer.from(data, "base64");

    const form = new FormData();
    form.append("file", buffer, { filename: fileName, contentType: mimeType });
    // attach metadata as Pinata keyvalues
    const metadata = JSON.stringify({ name: fileName, keyvalues: { doctorId, username } });
    form.append("pinataMetadata", metadata);

    const authHeader = process.env.PINATA_JWT?.startsWith("Bearer ") ? process.env.PINATA_JWT : `Bearer ${process.env.PINATA_JWT}`;

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: { Authorization: authHeader },
      body: form,
    });

    if (!res.ok) {
      const text = await res.text();
      return { statusCode: res.status, body: text };
    }
    const out = await res.json();
    return { statusCode: 200, body: JSON.stringify({ cid: out.IpfsHash }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}; 