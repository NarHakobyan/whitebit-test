function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

module.exports = async function (secs) {
  secs = secs || 1;
  await sleep(1000 * (secs || 1));
};
