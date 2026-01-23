import "server-only";


import arcjet, {
    detectBot,
    fixedWindow,
    protectSignup,
    sensitiveInfo,
    shield,
    slidingWindow,
} from "@arcjet/next"
import { env } from "./env";


export {
    detectBot,
    fixedWindow,
    protectSignup,
    sensitiveInfo,
    shield,
    slidingWindow
};



const isDevelopment = process.env.NODE_ENV === 'development';

export default arcjet({
    key: env.ARCJET_KEY,

    characteristics : ["fingerprint"],


    
    rules: [
        shield({
            mode: isDevelopment ? "DRY_RUN" : "LIVE",
        }),
    ],
});