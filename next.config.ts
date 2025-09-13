module.exports = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  output: 'standalone',
  images: {
    domains: [
      'img.icons8.com',
       'image.tmdb.org'
    ],
  }
};
