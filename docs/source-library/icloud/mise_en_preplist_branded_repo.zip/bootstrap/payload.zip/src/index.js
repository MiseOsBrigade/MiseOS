export function health() {
  return {
    ok: true,
    service: "self-unzip-expanded-app",
    bootstrapped: true
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(health(), null, 2));
}
