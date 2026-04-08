//Receives Big int, returns number
export function simplifyAmount(amount) {
  return (Number(amount) / 10 ** 6);
}

export function formatAmount(amount) {
  return (amount * 10 ** 6);
}

export function sumAllElements(list){

  let total = 0;

  for (let i = 0; i < list.length; i++) {
    total += list[i];
    
  }

  return total;

}
export function formatAmountArray(list){

  let formattedList = [];

  for (let i = 0; i < list.length; i++) {

    formattedList[i] = formatAmount(list[i]);

  }

  return formattedList;

}