import fetch from "node-fetch";

async function test(modelPart) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelPart}:generateContent?key=invalid_key`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "hi" }] }] })
  });
  console.log(modelPart, res.status, await res.text());
}

test("gemini-1.5-flash");
test("gemini-2.0-flash");
test("gemini-2.5-flash");
