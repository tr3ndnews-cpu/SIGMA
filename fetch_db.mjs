import fetch from "node-fetch";

const url = "https://dyrlsbevrjxdwplvzccr.supabase.co/rest/v1/admin_settings?id=eq.1&select=*";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5cmxzYmV2cmp4ZHdwbHZ6Y2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDc4NDMsImV4cCI6MjA5MjE4Mzg0M30.imTYUaYpd6pKgdHYwpxjW8JXlrtNW60VVQJpVxB9dzs";

async function run() {
  const res = await fetch(url, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`
    }
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
run();
