export async function register() {
  // Esse bloco roda APENAS no servidor (Node.js), nunca no Edge Runtime
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./app/_lib/env");
  }
}
