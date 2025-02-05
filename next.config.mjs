import nextra from "nextra";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true, // mandatory, otherwise won't export
  },
  assetPrefix: "/24-25-study-js-deep-dive/",
  basePath: "/24-25-study-js-deep-dive",
  // Optional: Change the output directory `out` -> `dist`
  // distDir: "build"
};
const withNextra = nextra({
  // ... other Nextra config options
});

export default withNextra(nextConfig);
