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
        userConfig: 'users/user-config/${USER-ID}',
        calendarList: 'appointments/calendar-list/${BUSINESS-ID}',
        roomsPublic: 'calendarPublic/rooms/${BUSINESS-ID}',
        calendarListPublic: 'calendarPublic/calendar-list/${BUSINESS-ID}',
        appointmentsPublic: 'calendarPublic/appointments/${ROOM-ID}',
        exportReservations: 'appointments/export-reservations/${BUSINESS-ID}',
        tags: 'tags/${BUSINESS-ID}'
    },

    create: {
        clients: 'clients/${BUSINESS-ID}',
        rooms: 'rooms/${BUSINESS-ID}',
        appointments: 'appointments/${BUSINESS-ID}',
        calendarBlock: 'calendar-blocks/${BUSINESS-ID}',
        tags: 'tags/${BUSINESS-ID}'
    },

    update: {
        clients: 'clients/${CLIENT-ID}',
        rooms: 'rooms/${ROOM-ID}',
        appointments: 'appointments/${APPOINTMENT-ID}',
        schedule: 'users/update-schedule/${USER-ID}',
        userConfig: 'users/update-user-config/${BUSINESS-ID}',
        company: 'users/update-company/${BUSINESS-ID}',
        tags: 'tags/${BUSINESS-ID}/${TAG-ID}'
    },

    delete: {
        rooms: 'rooms/${ROOM-ID}',
        appointments: 'appointments/${APPOINTMENT-ID}',
        calendarBlocks: 'calendar-blocks/${BLOCK-ID}',
        tags: 'tags/${BUSINESS-ID}/${TAG-ID}'
    }
};

export default endpoints;
