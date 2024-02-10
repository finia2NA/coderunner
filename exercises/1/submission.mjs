function isPrime(num) {
  if (num <= 1) {
    return false;
  }

  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      return false;
    }
  }

  return true;
}

// student must implement this function and have it exported
export function nthPrime(n) {
  let count = 0;
  let num = 2;

  while (count < n) {
    if (isPrime(num)) {
      count++;
    }
    num++;
  }

  return num - 1;
}
