import fetch from "node-fetch";

async function test() {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=invalid_key';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "hi" }] }] })
  });
  console.log(res.status, await res.text());
}
test();
