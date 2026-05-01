/** @type {import('next').NextConfig} */
const securityHeaders = [
  // Clickjacking — disallow framing entirely
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Force HTTPS for 2 years across subdomains, eligible for HSTS preload list
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Limit referrer leakage to cross-origin
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable powerful features by default
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // Note: CSP intentionally omitted for now — needs targeted audit of
  // inline scripts (JSON-LD in layout, print-button in /report/[id])
  // and Clerk/Sentry/Vercel-Analytics origins. Add in a follow-up PR
  // with Report-Only mode first to surface violations safely.
];

const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
