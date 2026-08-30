export const siteConfig = {
  privacyPolicy: {
    enabled: import.meta.env.VITE_ENABLE_PRIVACY_POLICY !== "false",
    path: "/privacy-policy.html"
  }
};
