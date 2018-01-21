export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export function pad(n: number): string {
  return ("0" + n.toString()).slice(-2);
}
