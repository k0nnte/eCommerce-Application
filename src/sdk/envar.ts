
interface EconEnv{
    CTP_PROJECT_KEY: string;
    CTP_CLIENT_SECRET: string;
    CTP_CLIENT_ID: string;
    CTP_AUTH_URL: string;
    CTP_API_URL: string;
    CTP_SCOPES: string;
}

export const Env: EconEnv = {
    CTP_PROJECT_KEY: "ecommerce-application-project",
    CTP_CLIENT_SECRET: "hebehXtby6lH3KRlpq_dfsiaA9uI1H22",
    CTP_CLIENT_ID: "Mt9vM_wZdATNYapenxLh2ENr",
    CTP_AUTH_URL: "https://auth.europe-west1.gcp.commercetools.com",
    CTP_API_URL: "https://api.europe-west1.gcp.commercetools.com",
    CTP_SCOPES: "manage_project:ecommerce-application-project"
}

