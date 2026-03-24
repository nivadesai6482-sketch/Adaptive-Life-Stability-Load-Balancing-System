const GOOGLE_CLIENT_ID = "32190739652-omal7cfl75mssanitim0oinhm6895gl4.apps.googleusercontent.com";
const REDIRECT_URI = window.location.origin + "/settings"; // Redirect back to settings page
const SCOPES = [
    "https://www.googleapis.com/auth/fitness.activity.read",
    "https://www.googleapis.com/auth/fitness.heart_rate.read"
];

export const initiateGoogleFitAuth = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
        `response_type=token&` +
        `scope=${encodeURIComponent(SCOPES.join(" "))}&` +
        `include_granted_scopes=true&` +
        `state=google_fit_auth`;

    window.location.href = authUrl;
};

export const handleAuthRedirect = () => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get("access_token");

    if (accessToken) {
        localStorage.setItem("google_fit_access_token", accessToken);
        // Clear the hash from the URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return true;
    }
    return false;
};

export const isGoogleFitConnected = () => {
    return !!localStorage.getItem("google_fit_access_token");
};

export const disconnectGoogleFit = () => {
    localStorage.removeItem("google_fit_access_token");
};
