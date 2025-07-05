"use strict";

const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const fileNameEl = document.getElementById("fileName");
const cidDisplay = document.getElementById("cidDisplay");
const shareBtn = document.getElementById("shareBtn");
const doctorIdInput = document.getElementById("doctorId");
const usernameInput = document.getElementById("username");

let selectedFile = null;

function toast(msg, isError = false) {
  const d = document.createElement("div");
  d.textContent = msg;
  d.style.position = "fixed";
  d.style.bottom = "20px";
  d.style.right = "20px";
  d.style.padding = "10px 16px";
  d.style.background = isError ? "#e74c3c" : "#27ae60";
  d.style.color = "#fff";
  d.style.borderRadius = "6px";
  d.style.zIndex = 9999;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 4000);
}

imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  selectedFile = file;
  // preview
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;
    imagePreview.innerHTML = "";
    imagePreview.appendChild(img);
    imagePreview.style.display = "block";
  };
  reader.readAsDataURL(file);
  fileNameEl.textContent = `File: ${file.name}`;
  fileNameEl.style.display = "block";
  shareBtn.style.display = "block";
});

shareBtn.addEventListener("click", async () => {
  if (!selectedFile) return toast("Choose a file first", true);
  shareBtn.disabled = true;
  try {
    const b64 = await new Promise((res) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result.split(",")[1]);
      fr.readAsDataURL(selectedFile);
    });
    const resp = await fetch("/.netlify/functions/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: selectedFile.name,
        mimeType: selectedFile.type,
        data: b64,
        doctorId: doctorIdInput.value,
        username: usernameInput.value,
      }),
    });
    if (!resp.ok) throw new Error(await resp.text());
    const { cid } = await resp.json();
    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    cidDisplay.textContent = url;
    cidDisplay.style.display = "block";
    await navigator.clipboard.writeText(url);
    toast("Link copied to clipboard!");
    shareBtn.style.display = "none";
  } catch (err) {
    console.error(err);
    toast("Upload failed", true);
  } finally {
    shareBtn.disabled = false;
  }
}); 