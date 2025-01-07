const endpoints = {
    whatsapp: {
        initializeClient: '/whatsapp/initialize-whatsapp-client',
        deleteClient: '/whatsapp/delete-whatsapp-client',
        generateQRCode: '/whatsapp/generate-qrcode',
        checkWhatsAppHeartbeat: '/whatsapp/whatsapp-client-heartbeat'
    },
    auth: {
        login: '/auth/login',
        requestPasswordReset: '/auth/request-password-reset',
        resetPassword: '/auth/reset-password',
        loginWithJwt: '/auth/get-user',
        refreshToken: '/auth/refresh-token'
    },
    read: {
        clients: 'clients/${USER-ID}',
        services: 'services/${USER-ID}',
        appointments: 'appointments/${USER-ID}',
        schedule: 'users/schedule/${USER-ID}',
        calendarBlocks: 'calendar-blocks/${USER-ID}',
        employees: 'users/${BUSINESS-ID}/employees',
        userConfig: 'users/user-config/${USER-ID}'
    },

    create: {
        clients: 'clients/${USER-ID}',
        services: 'services/${USER-ID}',
        appointments: 'appointments/${USER-ID}',
        calendarBlock: 'calendar-blocks/${USER-ID}'
    },

    update: {
        clients: 'clients/${USER-ID}',
        services: 'services/${USER-ID}',
        appointments: 'appointments/${APPOINTMENT-ID}',
        schedule: 'users/update-schedule/${USER-ID}',
        userConfig: 'users/update-user-config/${BUSINESS-ID}',
        company: 'users/update-company/${BUSINESS-ID}'
    },

    delete: {
        services: 'services/${SERVICE-ID}',
        appointments: 'appointments/${APPOINTMENT-ID}',
        calendarBlocks: 'calendar-blocks/${BLOCK-ID}'
    }
};

export default endpoints;
