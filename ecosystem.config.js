module.exports = {
  apps: [
    {
      name: 'copyzap',
      script: 'server.js', // This is for Standalone mode
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        GEMINI_API_KEY: 'your_key_here',
        PORT: 3000
      }
    }
  ]
};
