import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
  plugins: [
    VitePluginNode({
      adapter: 'express',    
      appPath: './src/server.ts',
      exportName: 'viteNodeApp', 
      tsCompiler: 'esbuild',   
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.json'], 
  },
});
