//Receives Big int, returns number
export function simplifyAmount(amount) {
  return (Number(amount) / 10 ** 6);
}

export function formatAmount(amount) {
  return (amount * 10 ** 6);
}