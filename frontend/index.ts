import { createRoot } from 'react-dom/client';
import { App } from "./App";
import "@fontsource/finger-paint"

const container = document.getElementById("app");
const root = createRoot(container!);

root.render(App());
