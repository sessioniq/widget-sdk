# SessionIQ Widget SDK (`@sessioniq/widget-sdk`)

[![npm version](https://badge.fury.io/js/%40sessioniq%2Fwidget-sdk.svg)](https://badge.fury.io/js/%40sessioniq%2Fwidget-sdk)

## Overview

Effortlessly integrate SessionIQ's recording capabilities and agent interaction widget into **any web application** with just a few lines of code.

This package acts as a simple wrapper around the core `@sessioniq/client-sdk` and the `@sessioniq/widget-vue` component. It handles:

- Initializing the SessionIQ client SDK.
- Dynamically loading Vue 3 onto the page if it's not already present.
- Mounting the SessionIQ agent widget UI component.
- Providing simple controls to interact with the widget (show/hide).

**Use this package if you want the quickest way to add the SessionIQ widget to a website, regardless of the framework it uses.**

## Installation

```bash
# Using npm
npm install @sessioniq/widget-sdk

# Using yarn
yarn add @sessioniq/widget-sdk

# Using pnpm
pnpm add @sessioniq/widget-sdk
```

## Basic Usage

Simply import the SDK and call the `setup` function with your `clientId`.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>SessionIQ Widget Example</title>
  </head>
  <body>
    <h1>My Application</h1>
    <p>The SessionIQ widget will be loaded here.</p>

    <!-- Your application content -->

    <script type="module">
      import { SessionIQWidgetSdk } from "@sessioniq/widget-sdk";

      (async () => {
        try {
          // Initialize the SDK and widget
          const widgetControls = await SessionIQWidgetSdk.setup({
            clientId: "YOUR_CLIENT_ID", // Replace with your actual Client ID
            // Optional: Specify baseUrl if self-hosting
            // baseUrl: 'https://your-sessioniq-api.com',
            // Optional: Set log level ('debug', 'info', 'warn', 'error', 'silent')
            // logLevel: 'info',
          });

          console.log("SessionIQ Widget SDK Initialized!");

          // You can now use the controls if needed:
          // widgetControls?.openWidget();
          // widgetControls?.closeWidget();
          // widgetControls?.toggleWidget();
        } catch (error) {
          console.error("Failed to initialize SessionIQ Widget SDK:", error);
        }
      })();
    </script>
  </body>
</html>
```

That's it! The widget will be added to the page (initially hidden) and recording will be managed automatically based on your SessionIQ project settings.

## API

### `SessionIQWidgetSdk.setup(options: SdkInitOptions): Promise<WidgetControls | undefined>`

- Initializes the core SDK, loads necessary dependencies (like Vue), mounts the widget, and returns controls for interacting with the widget UI.
- `options`: An object conforming to the `SdkInitOptions` from `@sessioniq/client-sdk`. **`clientId` is required.** Other options like `baseUrl` and `logLevel` are optional.
- Returns: A promise that resolves with the widget controls (an object with methods like `openWidget`, `closeWidget`, `toggleWidget`, and the reactive `isWidgetOpen` ref) or `undefined` if initialization fails.

## Under the Hood / Alternatives

This package simplifies the integration by combining two core SessionIQ libraries:

1.  **`@sessioniq/client-sdk`**: The main library for session recording, event tracking, interacting with the SessionIQ backend API, and handling real-time updates.

    - [View on npm](https://www.npmjs.com/package/@sessioniq/client-sdk)
    - Use this directly if you need fine-grained control over the recording lifecycle or want to integrate deeply within a specific framework without the UI widget.

2.  **`@sessioniq/widget-vue`**: A Vue 3 component that provides the user interface for interacting with SessionIQ agents (chat, analysis triggers).
    - [View on npm](https://www.npmjs.com/package/@sessioniq/widget-vue)
    - Use this directly if your application is already built with Vue 3 and you want to embed the widget manually within your component structure, potentially alongside the `@sessioniq/client-sdk`.

This `@sessioniq/widget-sdk` package orchestrates both, making the setup process trivial for projects that just need the complete widget functionality added quickly.
