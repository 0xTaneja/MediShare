const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { doctorId } = JSON.parse(event.body || "{}");
    if (!doctorId) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing doctorId" }) };
    }

    const filter = encodeURIComponent(
      JSON.stringify({ doctorId: { value: doctorId, op: "eq" } })
    );
    const url = `https://api.pinata.cloud/data/pinList?status=pinned&metadata[keyvalues]=${filter}`;

    const authHeader = process.env.PINATA_JWT?.startsWith("Bearer ")
      ? process.env.PINATA_JWT
      : `Bearer ${process.env.PINATA_JWT}`;

    const res = await fetch(url, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return { statusCode: res.status, body: text };
    }
    const data = await res.json();
    /* Pinata returns rows like:
       {
         id, ipfs_pin_hash, size, user_id, date_pinned,
         metadata: { name, keyvalues: { doctorId, username } }
       }
    */
    const files = data.rows.map((row) => ({
      cid: row.ipfs_pin_hash,
      fileName: row.metadata?.name || "unknown",
      datePinned: row.date_pinned,
      username: row.metadata?.keyvalues?.username || "",
    }));

    return { statusCode: 200, body: JSON.stringify(files) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}; 