var sum_to_n_a = function (n) {

  return Array.from({ length: n }, (_, i) => i + 1).reduce((acc, num) => acc + num, 0);

};

var sum_to_n_b = function (n) {
  function* range(n) {
    for (let i = 1; i <= n; i++) {
      yield i;
    }
  }
  return [...range(n)].reduce((acc, num) => acc + num, 0);

};

var sum_to_n_c = function (n) {
  return [...Array(n)].map((_, i) => i + 1).reduce((acc, num) => acc + num, 0);
};

console.log(sum_to_n_a(5))
console.log(sum_to_n_b(5))
console.log(sum_to_n_c(5)); // Output: 15