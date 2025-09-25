import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { Toaster, toast } from "react-hot-toast";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                    gutter={8}
                    containerClassName=""
                    containerStyle={{}}
                    toastOptions={{
                        className: "",
                        duration: 1000,
                        style: {
                            background: "#363636",
                            color: "#fff",
                        },

                        success: {
                            duration: 2000,
                            theme: {
                                primary: "green",
                                secondary: "black",
                            },
                        },
                        error: {
                            duration: 1000,
                            theme: {
                                primary: "red",
                                secondary: "black",
                            },
                        },
                    }}
                />
                <App {...props} />
            </>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
