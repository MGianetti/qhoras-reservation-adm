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
        clients: 'clients/${BUSINESS-ID}',
        rooms: 'rooms/${BUSINESS-ID}',
        appointments: 'appointments/${ROOM-ID}',
        calendarBlocks: 'calendar-blocks/${ROOM-ID}',
        employees: 'users/${BUSINESS-ID}/employees',
        userConfig: 'users/user-config/${USER-ID}'
    },

    create: {
        clients: 'clients/${BUSINESS-ID}',
        rooms: 'rooms/${BUSINESS-ID}',
        appointments: 'appointments/${USER-ID}',
        calendarBlock: 'calendar-blocks/${USER-ID}'
    },

    update: {
        clients: 'clients/${CLIENT-ID}',
        rooms: 'rooms/${ROOM-ID}',
        appointments: 'appointments/${APPOINTMENT-ID}',
        schedule: 'users/update-schedule/${USER-ID}',
        userConfig: 'users/update-user-config/${BUSINESS-ID}',
        company: 'users/update-company/${BUSINESS-ID}'
    },

    delete: {
        rooms: 'rooms/${ROOM-ID}',
        appointments: 'appointments/${APPOINTMENT-ID}',
        calendarBlocks: 'calendar-blocks/${BLOCK-ID}'
    }
};

export default endpoints;
