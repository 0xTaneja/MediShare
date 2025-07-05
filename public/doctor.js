"use strict";

const doctorInput = document.getElementById("doctorId");
const fetchBtn = document.getElementById("fetchBtn");
const table = document.getElementById("results");
const tbody = table.querySelector("tbody");

function toast(msg, err = false) {
  const div = document.createElement("div");
  div.textContent = msg;
  div.style.position = "fixed";
  div.style.bottom = "20px";
  div.style.right = "20px";
  div.style.padding = "10px 16px";
  div.style.background = err ? "#e74c3c" : "#27ae60";
  div.style.color = "#fff";
  div.style.borderRadius = "6px";
  div.style.zIndex = 9999;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}

fetchBtn.addEventListener("click", async () => {
  const id = doctorInput.value.trim();
  if (!id) return toast("Enter Doctor ID", true);
  fetchBtn.disabled = true;
  tbody.innerHTML = "";
  table.style.display = "none";
  try {
    const res = await fetch("/.netlify/functions/getUploads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorId: id }),
    });
    if (!res.ok) throw new Error(await res.text());
    const files = await res.json();
    if (!files.length) {
      toast("No files found");
    } else {
      files.forEach((f) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${f.fileName}</td><td>${f.username}</td><td>${new Date(f.datePinned).toLocaleDateString()}</td><td><a href="https://gateway.pinata.cloud/ipfs/${f.cid}" target="_blank">Open</a></td>`;
        tbody.appendChild(tr);
      });
      table.style.display = "table";
    }
  } catch (err) {
    console.error(err);
    toast("Fetch failed", true);
  } finally {
    fetchBtn.disabled = false;
  }
}); 