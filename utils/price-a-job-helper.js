const filterCounts = (counts) => {
  return Object.fromEntries(
    Object.entries(counts).filter(([key, value]) => value > 10)
  );
};

// Helper function to transform counts object into an array of objects
const transformCountsToArray = (counts) => {
  return Object.entries(counts).map(([key, count]) => {
    const [location, experience, sector] = key
      .split(",")
      .map((item) => item.trim());
    return { location, experience, ...(sector && { sector }), count };
  });
};

module.exports = {
  filterCounts,
  transformCountsToArray,
};
