const { toMatchImageSnapshot } = require("jest-image-snapshot");

module.exports = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postVisit(page, context) {
    // Wait for the page to be stable
    await page.waitForTimeout(200);

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      customSnapshotsDir: `${process.cwd()}/__visual_snapshots__`,
      customSnapshotIdentifier: context.id,
      failureThreshold: 0.05,
      failureThresholdType: "percent",
    });
  },
};
