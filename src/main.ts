import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

interface BootstrapModule {
  (moduleType: unknown): Promise<unknown>;
}

interface PlatformBrowserDynamic {
  bootstrapModule: BootstrapModule;
}

const platform: PlatformBrowserDynamic = platformBrowserDynamic();

platform.bootstrapModule(AppModule)
  .catch((err: unknown): void => console.error(err));