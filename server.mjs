import dotenv from "dotenv";
import http from "node:http";
import { readFile } from "node:fs/promises";
import formidable from "formidable";

dotenv.config({ path: ".env.local" });
dotenv.config();

const port = Number(process.env.API_PORT || 3001);
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const recipient = process.env.VITE_CONTACT_EMAIL || "Neerajchauhangvr@gmail.com";
const autoReply = process.env.VITE_AUTO_REPLY || "Thanks for your interest in AVCENA Gardening & Lawnmowing. We will contact you shortly.";
const from = process.env.RESEND_FROM_EMAIL;

const value = (field) => Array.isArray(field) ? field[0] : (field || "");

function parseForm(request) {
  return new Promise((resolve, reject) => {
    formidable({ multiples: true, allowEmptyFiles: true, minFileSize: 0, maxFileSize: 10 * 1024 * 1024 }).parse(request, (error, fields, files) => {
      if (error) reject(error);
      else resolve({ fields, files });
    });
  });
}

async function sendEmail(payload) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(await response.text());
}

const server = http.createServer(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", frontendOrigin);
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }
  if (request.method !== "POST" || request.url !== "/api/submit") {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  try {
    if (!process.env.RESEND_API_KEY || !from) throw new Error("RESEND_API_KEY and RESEND_FROM_EMAIL are required");
    const { fields, files } = await parseForm(request);
    const customerEmail = value(fields.email);
    const details = Object.entries(fields).map(([key, field]) => `${key}: ${value(field)}`).join("\n");
    const fileList = Object.values(files).flatMap((file) => Array.isArray(file) ? file : [file]).filter((file) => file?.size > 0);
    const attachments = await Promise.all(fileList.map(async (file) => ({
      filename: file.originalFilename || "photo",
      content: (await readFile(file.filepath)).toString("base64")
    })));

    await sendEmail({
      from,
      to: [recipient],
      reply_to: customerEmail,
      subject: "New AVCENA quote enquiry",
      text: details,
      ...(attachments.length ? { attachments } : {})
    });
    await sendEmail({
      from,
      to: [customerEmail],
      subject: "Thanks for contacting AVCENA",
      text: autoReply
    });

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true }));
  } catch (error) {
    console.error(error);
    response.writeHead(500, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: error.message || "Unable to send enquiry" }));
  }
});

server.listen(port, () => console.log(`Email API listening on http://localhost:${port}`));
