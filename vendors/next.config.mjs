import { withGluestackUI } from '@gluestack/ui-next-adapter';
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['nativewind', 'react-native-css-interop', '@gluestack-ui/switch', '@gluestack-ui/form-control'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withGluestackUI(nextConfig);
