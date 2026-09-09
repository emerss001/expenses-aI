import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // testes ficam ao lado do modulo que cobrem
    include: ["app/**/*.test.ts"],
  },
});
