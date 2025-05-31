import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';

export async function activateLocale(locale = 'pt') {
    let messages;
    switch (locale) {
        case 'pt':
            messages = (await import('./locales/pt.mjs')).messages;
            break;
        case 'en':
            messages = (await import('./locales/en.mjs')).messages;
            break;
        default:
            messages = (await import('./locales/pt.mjs')).messages;
    }

    i18n.load(locale, messages);
    i18n.activate(locale);
}

export function I18n({ children }) {
    return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
}
