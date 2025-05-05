import { SdkInitOptions, SessionIQSdk } from "@sessioniq/client-sdk";
import { RemoteAgentWidget, useWidget } from "@sessioniq/widget-vue";

const WIDGET_CONTAINER_ID = "sessioniq-widget-container";

const createWidgetContainer = (): HTMLElement => {
  if (document.getElementById(WIDGET_CONTAINER_ID)) {
    return document.getElementById(WIDGET_CONTAINER_ID)!;
  }
  const container = document.createElement("div");
  container.id = WIDGET_CONTAINER_ID;
  document.body.appendChild(container);
  return container;
};

const loadVueIfNeeded = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined") {
      if ((window as any).Vue) {
        resolve();
      } else {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/vue@3/dist/vue.global.js";
        script.onload = () => resolve();
        script.onerror = () => {
          console.error("Failed to load Vue.js from CDN.");
          reject(new Error("Failed to load Vue.js from CDN."));
        };
        document.head.appendChild(script);
      }
    } else {
      console.warn("Cannot load Vue: not running in a browser environment.");
      reject(new Error("Not running in a browser environment."));
    }
  });
};

type SetupResult = ReturnType<typeof useWidget> | undefined;

export const SessionIQWidgetSdk = {
  setup: async (sdkOptions: SdkInitOptions): Promise<SetupResult> => {
    let sdk: SessionIQSdk;
    let widgetControls: SetupResult;

    try {
      sdk = new SessionIQSdk();
      await sdk.init({
        clientId: sdkOptions.clientId,
        baseUrl: sdkOptions.baseUrl || "https://api.sessioniq.ai/api/v1",
        logLevel: sdkOptions.logLevel || "silent",
        ...sdkOptions,
      });
    } catch (error) {
      console.error("SessionIQ SDK initialization failed:", error);
      throw error;
    }

    try {
      await loadVueIfNeeded();
    } catch (error) {
      console.error("Failed to load Vue runtime:", error);
      throw error;
    }

    // 3. Create container and mount widget (deferred until DOM is ready)
    const mountWidget = () => {
      if (typeof window !== "undefined" && (window as any).Vue) {
        try {
          const container = createWidgetContainer();
          const app = (window as any).Vue.createApp(RemoteAgentWidget, {
            sdk: sdk,
          });
          app.mount(`#${container.id}`);

          widgetControls = useWidget();

          widgetControls?.closeWidget?.();
        } catch (mountError) {
          console.error(
            "Failed to create or mount SessionIQ Widget:",
            mountError
          );
          widgetControls = undefined;
        }
      } else {
        console.error(
          "Vue could not be loaded or found. SessionIQ Widget cannot be mounted."
        );
        widgetControls = undefined;
      }
    };

    // Check if DOM is already ready, otherwise wait for it
    if (typeof window !== "undefined") {
      if (document.readyState === "loading") {
        // Loading hasn't finished yet
        document.addEventListener("DOMContentLoaded", mountWidget);
      } else {
        // `DOMContentLoaded` has already fired
        mountWidget();
      }
    } else {
      // Handle non-browser environment? Or assume it won't mount anyway.
      console.warn("Not in a browser environment, cannot mount widget.");
      widgetControls = undefined;
    }

    // Return the widget controls (might be undefined if setup failed or DOM isn't ready yet)
    // Note: If setup returns before DOMContentLoaded, controls will be initially undefined.
    // Consumers might need to handle this possibility or the SDK could return a Promise resolving
    // with the controls once mounted.
    // For simplicity now, we return the potentially undefined controls synchronously after setup starts.
    return widgetControls;
  },
};
