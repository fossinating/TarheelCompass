import ReactGA from "react-ga4";

export const initGA = () => {
    if (process.env.NODE_ENV === "production") {
    if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
        ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID);
        if (localStorage && localStorage.getItem("terms") === "true") {
            ReactGA.gtag('consent', 'default', {
                'ad_storage': localStorage.getItem("ads") === "true" ? "granted" : "denied",
                'ad_user_data': localStorage.getItem("ads") === "true" ? "granted" : "denied",
                'ad_personalization': localStorage.getItem("ads") === "true" ? "granted" : "denied",
                'analytics_storage': localStorage.getItem("analytics") === "true" ? "granted" : "denied"
            });
        } else {
            ReactGA.gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'wait_for_update': 500
            });
        }
            
    }
    }
    console.log(`Not initializing GA because NODE_ENV is '${process.env.NODE_ENV}'`)
};

export const updateGAConsent = () => {
    if (localStorage) {
        ReactGA.gtag('consent', 'update', {
            'ad_storage': localStorage.getItem("ads") === "true" ? "granted" : "denied",
            'ad_user_data': localStorage.getItem("ads") === "true" ? "granted" : "denied",
            'ad_personalization': localStorage.getItem("ads") === "true" ? "granted" : "denied",
            'analytics_storage': localStorage.getItem("analytics") === "true" ? "granted" : "denied",
        });
    } else {
        console.error("Tried updating GA consent before localstorage available")
    }
}