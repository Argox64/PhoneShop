import i18n from 'i18next';
import Backend, { FsBackendOptions } from "i18next-fs-backend"
import i18nextMiddleware from "i18next-http-middleware"
import { join } from 'path';

export const defaultNS = 'common'; // Default name space

i18n
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init<FsBackendOptions>({
        lng: 'en', // Default language
        fallbackLng: 'en',
        ns: "common",
        backend: {
            loadPath: join(__dirname, '../locales/{{ns}}-{{lng}}.json')
        },
        preload: ['en', 'fr']
});

export default i18n;