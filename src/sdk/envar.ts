
interface EconEnv{
    CTP_PROJECT_KEY: string;
    CTP_CLIENT_SECRET: string;
    CTP_CLIENT_ID: string;
    CTP_AUTH_URL: string;
    CTP_API_URL: string;
    CTP_SCOPES: string;
}

export const Env: EconEnv = {
    CTP_PROJECT_KEY: "qazqwertyuiopqaz",
    CTP_CLIENT_SECRET: "SaUDWwRm1nbgSBBDTJfe5GXzfqMiL5nr",
    CTP_CLIENT_ID: "fUScNW7TydV_cj_rp7LvEttk",
    CTP_AUTH_URL: "https://auth.europe-west1.gcp.commercetools.com",
    CTP_API_URL: "https://api.europe-west1.gcp.commercetools.com",
    CTP_SCOPES: "manage_project:qazqwertyuiopqaz"
}

