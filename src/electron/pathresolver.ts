import path from 'path';
import { app } from 'electron';
// import { isDev } from "./utils.js";

export function resolveUiPath(): string {
    return path.join(
        app.getAppPath(),
        "/dist-ui/index.html"
    );
};