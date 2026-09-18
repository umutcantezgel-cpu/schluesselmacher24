const numItems = 20000;
const rawLinks = Array.from({ length: numItems }, (_, i) => ({
  href: `/link-${i % 5000}`, // Creates duplicates
  label: `Link ${i}`,
}));

console.log(`Benchmarking deduplication for ${numItems} items...`);

// Current O(N^2) Approach
console.time('Current O(N^2) Approach');
const deduplicatedN2 = rawLinks.filter(
  (link, index, list) => list.findIndex((l) => l.href === link.href) === index
);
console.timeEnd('Current O(N^2) Approach');

// New O(N) Approach using Set
console.time('Optimized O(N) Approach');
const seen = new Set();
const deduplicatedN = rawLinks.filter((link) => {
  if (seen.has(link.href)) {
    return false;
  }
  seen.add(link.href);
  return true;
});
console.timeEnd('Optimized O(N) Approach');

// Verify correctness
console.log(`O(N^2) result length: ${deduplicatedN2.length}`);
console.log(`O(N) result length: ${deduplicatedN.length}`);
console.log(`Correctness match: ${deduplicatedN2.length === deduplicatedN.length}`);
