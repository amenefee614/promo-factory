/**
 * Demo Mode Configuration
 * 
 * Enable this to bypass authentication for testing and demos.
 * Users will be automatically logged in as a demo user.
 */

export const DEMO_MODE_ENABLED = true;

export const DEMO_USER = {
  id: 999999,
  openId: "demo-open-id",
  name: "Demo User",
  email: "demo@promofactory.app",
  loginMethod: "demo",
  lastSignedIn: new Date(),
};
