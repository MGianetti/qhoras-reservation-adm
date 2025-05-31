export default {
    locales: ['pt', 'en'],
    sourceLocale: 'pt',
    catalogs: [
        {
            path: 'src/infraestructure/i18n/locales/{locale}',
            include: ['src']
        }
    ],
    format: 'po',
    compileNamespace: 'es',

};
