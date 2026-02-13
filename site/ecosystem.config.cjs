module.exports = {
  apps: [
    {
      name: "novastack-site",
      script: "npm",
      args: "start",
      cwd: "/home/servidor-dcnet/apps/novastack/site",
      env: {
  NODE_ENV: "production",
  JWT_SECRET: "337fa4648545de8c81581c57a65e499e2b008090ee03616f119d975242b9216ad714117499e391c58a955c2267862957",
  ADMIN_EMAIL: "dc.net.infinity@gmail.com",
  ADMIN_PASSWORD_HASH_B64: "JDJiJDEwJEhweG9WcmJTZ3Z3em16VzRaREZYdnVRUG04MWRtRlBVWC5OWmR2L1F5Q0NjUVYxNmc5NDhl"
}
    }
  ]
};
