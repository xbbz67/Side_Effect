import manifest from './manifest.json';
import { Assets, Texture } from 'pixi.js';
export const AssetRegistry = {
  manifest: manifest as Record<string, string | null>,
  textures: new Map<string, Texture>(),
  get(key: string) {
    return this.textures.get(key);
  },
  path(key: string) {
    return this.manifest[key] ?? undefined;
  },
  async load() {
    await Promise.all(
      Object.entries(this.manifest)
        .filter(([, path]) => path)
        .map(async ([key, path]) => {
          this.textures.set(key, await Assets.load<Texture>(path!));
        }),
    );
  },
};
