import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: { colors: { ink: '#F7F5F0', panel: '#FCFBF8', signal: '#58715B', amber: '#AD7B45', mist: '#292822', line: '#D9D4CB' } } },
  plugins: []
};
export default config;
