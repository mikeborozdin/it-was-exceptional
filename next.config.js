/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverActionsBodySizeLimit: '100mb',
  },
  images: {
    domains: [
      'lh0.googleusercontent.com',
      'lh1.googleusercontent.com', 
      'lh2.googleusercontent.com', 
      'lh3.googleusercontent.com', 
      'lh4.googleusercontent.com', 
      'lh5.googleusercontent.com', 
      'lh6.googleusercontent.com', 
      'lh7.googleusercontent.com', 
      'lh8.googleusercontent.com', 
      'lh9.googleusercontent.com', 
      'lh10.googleusercontent.com', 
      'lh11.googleusercontent.com',
      'lh12.googleusercontent.com', 
      'lh13.googleusercontent.com', 
      'lh14.googleusercontent.com',
      'lh15.googleusercontent.com', 
      'lh16.googleusercontent.com',
      'lh17.googleusercontent.com', 
      'lh18.googleusercontent.com',
      'lh19.googleusercontent.com', 
      'lh20.googleusercontent.com',
      'yote5zsaxkbeya8h.public.blob.vercel-storage.com']
    ,
  }
};

module.exports = nextConfig
