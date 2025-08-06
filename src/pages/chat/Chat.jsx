import dayjs from 'dayjs';
import { createMachine } from 'xstate';
import PhoneInput from 'mui-phone-input';
import { IoMdSend } from 'react-icons/io';
import { useMachine } from '@xstate/react';
import { useLocation } from 'react-router-dom';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import chatBg from 'src/assets/images/chat-background.jpg';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Paper, TextField, Button, MenuItem, IconButton, FormHelperText } from '@mui/material';

import chatService from '../../domains/chat/chatService';
import calendarReadOnlyService from '../../domains/calendarReadOnly/calendarReadOnlyService';

dayjs.extend(customParseFormat);

const chatMachine = createMachine({
    id: 'chat',
    initial: 'isMember',
    states: {
        isMember: { on: { NEXT: 'welcome' } },
        welcome: { on: { NEXT: 'init' } },
        init: { on: { NEXT: 'roomSelection' } },
        roomSelection: { on: { SELECT_ROOM: 'daySelection' } },
        daySelection: { on: { SELECT_DATE: 'startTimeSelection' } },
        startTimeSelection: { on: { SELECT_START: 'endTimeSelection' } },
        endTimeSelection: { on: { SELECT_END: 'peopleNumberSelection' } },
        peopleNumberSelection: { on: { SELECT_NUMBER: 'eventNameSelection' } },
        eventNameSelection: { on: { SUBMIT_EVENT_NAME: 'eventTopicSelection' } },
        eventTopicSelection: { on: { SUBMIT_EVENT_TOPIC: 'eventMinistrySelection' } },
        eventMinistrySelection: { on: { SUBMIT_EVENT_MINISTRY: 'eventRecurrenceSelection' } },
        eventRecurrenceSelection: { on: { SUBMIT_EVENT_RECURRENCE: 'contactPhone' } },
        contactPhone: { on: { SUBMIT_CONTACT_PHONE: 'contactName' } },
        contactName: { on: { SUBMIT_CONTACT_NAME: 'confirmReservation' } },
        confirmReservation: { on: { CONFIRM: 'done', EDIT: 'editChoice' } },
        editChoice: {
            on: {
                SELECT_SALA: 'roomSelection',
                SELECT_DATE: 'daySelection',
                SELECT_START: 'startTimeSelection',
                SELECT_END: 'endTimeSelection',
                SELECT_NUMBER: 'peopleNumberSelection',
                SUBMIT_EVENT_NAME: 'eventNameSelection',
                SUBMIT_EVENT_TOPIC: 'eventTopicSelection',
                SUBMIT_EVENT_MINISTRY: 'eventMinistrySelection',
                SUBMIT_EVENT_RECURRENCE: 'eventRecurrenceSelection',
                EDIT_CONTACT_PHONE: 'contactPhone',
                EDIT_CONTACT_NAME: 'contactName'
            }
        },
        done: { type: 'final' }
    }
});

const prompts = {
    isMember: 'Você é membro ativo?',
    welcome: 'Bem-vindo! Vamos iniciar?',
    init: 'Esta página permite reservar salas. Vamos lá!',
    roomSelection: 'Qual sala você deseja reservar?',
    daySelection: 'Escolha a data:',
    startTimeSelection: 'Escolha horário de início:',
    endTimeSelection: 'Escolha horário de término:',
    peopleNumberSelection: 'Quantas pessoas irão participar?',
    eventNameSelection: 'Qual o nome do evento?',
    eventTopicSelection: 'Sobre o que será o evento?',
    eventMinistrySelection: 'De qual ministério você faz parte?',
    eventRecurrenceSelection:
        'O evento será recorrente? Se sim, informe o período, senão digite "Não".\nExemplo: Este evento terá a recorrência do dia 14/04/2025 até o dia 18/04/2025.',
    contactPhone: 'Qual o número do whatsapp para contato?',
    contactName: 'Qual o seu nome?',
    confirmReservation: 'Confira todos os dados e confirme:'
};

const RoomSelect = ({ value, onChange, rooms }) => (
    <TextField select fullWidth value={value} onChange={(e) => onChange(e.target.value)}>
        {rooms.map((room) => (
            <MenuItem key={room.id} value={room.id}>
                {room.name}
            </MenuItem>
        ))}
    </TextField>
);
const TimeSelect = ({ value, onChange, timeSlots }) => (
    <TextField select fullWidth value={value} onChange={(e) => onChange(e.target.value)}>
        {timeSlots.map((timeSlot, index) => (
            <MenuItem key={index} value={timeSlot}>
                {timeSlot}
            </MenuItem>
        ))}
    </TextField>
);

const Chat = () => {
    const [state, send] = useMachine(chatMachine);
    const [data, setData] = useState({});
    const [messages, setMessages] = useState([]);
    const [blocked, setBlocked] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const containerRef = useRef(null);

    const [roomInput, setRoomInput] = useState('');
    const [dateInput, setDateInput] = useState('');
    const [startInput, setStartInput] = useState('');
    const [endInput, setEndInput] = useState('');
    const [peopleInput, setPeopleInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [topicInput, setTopicInput] = useState('');
    const [ministryInput, setMinistryInput] = useState('');
    const [recurrenceInput, setRecurrenceInput] = useState('');
    const [reserverNameInput, setReserverNameInput] = useState('');
    const [contactPhoneInput, setContactPhoneInput] = useState('');

    const [rooms, setRooms] = useState([]);
    const [initialTimeSlots, setInitialTimeSlots] = useState([]);
    const [initialEndTimeSlots, setInitialEndTimeSlots] = useState([]);
    const [isNameLocked, setIsNameLocked] = useState(false);

    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const businessIdQueryParams = searchParams.get('business');

    const today = dayjs().format('YYYY-MM-DD');

    const fetchRooms = useCallback(async () => {
        try {
            if (!businessIdQueryParams) return;
            const roomsData = await calendarReadOnlyService.readRoom({
                businessId: businessIdQueryParams,
                page: 1,
                limit: 1000
            });
            setRooms(roomsData);
        } catch (error) {
            console.error('Failed to fetch rooms:', error);
        }
    }, [businessIdQueryParams]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    useEffect(() => {
        const el = containerRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages, isTyping]);

    useEffect(() => {
        const prompt = prompts[state.value];
        if (prompt) {
            setIsTyping(true);
            const t = setTimeout(() => {
                setIsTyping(false);
                setMessages((m) => [...m, { from: 'bot', text: prompt }]);
                if (state.value === 'init') send({ type: 'NEXT' });
            }, 700);
            return () => clearTimeout(t);
        }
    }, [state.value, send]);

    useEffect(() => {
        if (state.value === 'confirmReservation') {
            const summary = Object.entries(data)
                .map(([k, v]) => {
                    if (k === 'SalaId') return '';
                    return `${k}: ${v}`;
                })
                .filter(Boolean)
                .join('\n');
            setIsTyping(true);
            const t = setTimeout(() => {
                setIsTyping(false);
                setMessages((m) => [...m, { from: 'bot', text: summary }]);
            }, 700);
            return () => clearTimeout(t);
        }
    }, [state.value, data]);

    const handleEvent = (type, userText) => {
        if (userText) setMessages((m) => [...m, { from: 'user', text: userText }]);
        send({ type });
    };

    const handleNonMember = () => {
        setMessages((m) => [
            ...m,
            { from: 'user', text: 'Não' },
            {
                from: 'bot',
                text: 'Este canal é reservado para membros ativos. Por favor, entre em contato via eventos@igrejadacidade.org.br.'
            }
        ]);
        setBlocked(true);
    };

    const handleSelect = (key, value, eventType) => {
        setData((d) => ({ ...d, [key]: value }));
        handleEvent(eventType, value);
    };

    const handleSelectRoom = async () => {
        if (!roomInput) return;
        const room = rooms.find((r) => r.id === roomInput);
        const roomName = room ? room.name : roomInput;
        setData((d) => ({ ...d, SalaId: roomInput, Sala: roomName }));
        handleEvent('SELECT_ROOM', roomName);
    };

    const handleSelectDate = async () => {
        if (!dateInput) return;
        if (dayjs(dateInput).isBefore(dayjs(today), 'day')) {
            setMessages((m) => [...m, { from: 'bot', text: 'Reserve apenas para dias futuros. Escolha uma data válida.' }]);
            return;
        }
        const date = dayjs(dateInput).format('DD/MM/YYYY');
        setData((d) => ({ ...d, Data: date }));
        const availableTimeSlots = await chatService.readAvailableTimeSlots(roomInput, date);
        setInitialTimeSlots(availableTimeSlots);
        handleEvent('SELECT_DATE', date);
    };

    const handleSelectStartTime = async () => {
        if (!startInput) return;
        setData((d) => ({ ...d, Início: startInput }));
        const availableEndTimeSlots = await chatService.readAvailableEndTimeSlots(roomInput, data.Data, startInput);
        setInitialEndTimeSlots(availableEndTimeSlots);
        handleEvent('SELECT_START', startInput);
    };

    const handleSelectEndTime = async () => {
        if (!endInput) return;
        setData((d) => ({ ...d, Término: endInput }));
        handleEvent('SELECT_END', endInput);
    };

    const handleSelectPeopleNumber = () => {
        const num = parseInt(peopleInput, 10);
        if (isNaN(num) || num <= 0) {
            setMessages((m) => [...m, { from: 'bot', text: 'Informe um número válido de pessoas (maior que zero).' }]);
            return;
        }

        const roomId = data.SalaId || roomInput;
        const room = rooms.find((r) => r.id === roomId);
        const capacity = room ? parseInt(room.capacity, 10) : undefined;

        if (capacity !== undefined && !isNaN(capacity) && num > capacity) {
            setMessages((m) => [
                ...m,
                {
                    from: 'bot',
                    text: `A sala selecionada tem capacidade máxima de ${capacity} pessoas. Você colocou ${num}, por favor reduza.`
                }
            ]);
            return;
        }

        setData((d) => ({ ...d, Pessoas: num }));
        handleEvent('SELECT_NUMBER', String(num));
    };

    const formatPhoneE164 = (phoneObj) => {
        if (!phoneObj || typeof phoneObj !== 'object') return '';
        const { countryCode, areaCode, phoneNumber } = phoneObj;
        return `+${countryCode || ''}${areaCode || ''}${phoneNumber || ''}`;
    };

    const buildLocalPhone = (phoneObj) => {
        if (!phoneObj || typeof phoneObj !== 'object') return '';
        const { areaCode, phoneNumber } = phoneObj;
        return `${areaCode || ''}${phoneNumber || ''}`;
    };

    const handleSubmitContactPhone = async () => {
        if (!contactPhoneInput || typeof contactPhoneInput !== 'object') {
            setMessages((m) => [...m, { from: 'bot', text: 'Telefone inválido. Informe um número válido.' }]);
            return;
        }

        const isValid = typeof contactPhoneInput.valid === 'function' ? contactPhoneInput.valid(true) : false;

        if (!isValid) {
            setMessages((m) => [...m, { from: 'bot', text: 'Telefone inválido. Informe um número válido.' }]);
            return;
        }

        const e164 = formatPhoneE164(contactPhoneInput);
        const localNumber = buildLocalPhone(contactPhoneInput);

        setData((d) => ({ ...d, Telefone: e164 }));
        handleEvent('SUBMIT_CONTACT_PHONE', e164);

        try {
            const user = await chatService.getUserByPhoneNumber(businessIdQueryParams, localNumber);
            if (user) {
                setIsNameLocked(true);
                setData((d) => ({ ...d, clientId: user.id, 'Nome do responsável': user.name }));

                setMessages((m) => [...m, { from: 'bot', text: `Nome do responsável encontrado: ${user.name}` }]);

                send({ type: 'SUBMIT_CONTACT_NAME' });
            } else {
                setIsNameLocked(false);
            }
        } catch (err) {
            console.error('Erro ao buscar usuário por telefone:', err);
            setIsNameLocked(false);
        }
    };

    const handleSubmitContactName = () => {
        if (isNameLocked) {
            setMessages((m) => [...m, { from: 'bot', text: 'O nome foi preenchido automaticamente a partir do telefone e não pode ser editado.' }]);
            return;
        }
        if (!reserverNameInput.trim()) {
            setMessages((m) => [...m, { from: 'bot', text: 'Por favor informe o nome da pessoa responsável.' }]);
            return;
        }
        setData((d) => ({ ...d, 'Nome do responsável': reserverNameInput.trim() }));
        handleEvent('SUBMIT_CONTACT_NAME', reserverNameInput.trim());
    };

    const handleConfirmReservation = async () => {
        if (!businessIdQueryParams) {
            setMessages((m) => [...m, { from: 'bot', text: 'Erro interno: nenhum businessId fornecido.' }]);
            return;
        }

        const roomId = data.SalaId || roomInput;
        if (!roomId) {
            setMessages((m) => [...m, { from: 'bot', text: 'Você precisa selecionar uma sala.' }]);
            return;
        }
        if (!dateInput || !startInput || !endInput) {
            setMessages((m) => [...m, { from: 'bot', text: 'Data e horários precisam estar preenchidos.' }]);
            return;
        }

        let clientId = data.clientId;
        if (!clientId) {
            const clientName = data['Nome do responsável'] || reserverNameInput;
            if (!clientName || !clientName.trim()) {
                setMessages((m) => [...m, { from: 'bot', text: 'Nome do responsável é obrigatório.' }]);
                return;
            }
            const localPhone = buildLocalPhone(contactPhoneInput);
            if (!localPhone) {
                setMessages((m) => [...m, { from: 'bot', text: 'Telefone é obrigatório para criar o cliente.' }]);
                return;
            }

            const clientPayload = {
                clientName: clientName.trim(),
                clientPhoneNumber: localPhone
            };

            const createdClient = await chatService.createClientViaChat(businessIdQueryParams, clientPayload);
            if (!createdClient || !createdClient.id) {
                setMessages((m) => [...m, { from: 'bot', text: 'Falha ao criar cliente. Tente novamente.' }]);
                return;
            }
            clientId = createdClient.id;
            setData((d) => ({ ...d, clientId }));
            setMessages((m) => [...m, { from: 'bot', text: `Cliente criado: ${clientName}` }]);
        }

        const eventTopic = data['Assunto'] || topicInput || '';
        const eventMinistry = data['Ministério'] || ministryInput || '';
        const selectedPeopleNumber = data['Pessoas'] || peopleInput || '';
        const eventName = data['Nome do evento'] || nameInput || '';
        const eventRecurrence = data['Recorrência'] || recurrenceInput || '';

        const dateAndTimeStart = dayjs(`${dateInput} ${startInput}`, 'YYYY-MM-DD HH:mm').format('YYYY/MM/DD HH:mm:ss');

        const dateAndTimeEnd = dayjs(`${dateInput} ${endInput}`, 'YYYY-MM-DD HH:mm').format('YYYY/MM/DD HH:mm:ss');

        const solicitationPayload = {
            clientId,
            roomId,
            dateAndTimeStart,
            dateAndTimeEnd,
            eventTopic,
            eventMinistry,
            selectedPeopleNumber,
            eventName,
            eventRecurrence
        };

        const solicitation = await chatService.createSolicitationViaChat(businessIdQueryParams, solicitationPayload);
        if (!solicitation || !solicitation.id) {
            setMessages((m) => [...m, { from: 'bot', text: 'Falha ao criar solicitação. Tente novamente mais tarde.' }]);
            return;
        }

        setMessages((m) => [...m, { from: 'bot', text: 'Sua solicitação foi criada com sucesso!' }]);
        handleEvent('CONFIRM', 'Confirmar!');
    };

    const renderWidget = () => {
        if (blocked) return null;
        switch (state.value) {
            case 'isMember':
                return (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button onClick={() => handleEvent('NEXT', 'Sim')}>Sim</Button>
                        <Button onClick={handleNonMember}>Não</Button>
                    </Box>
                );
            case 'welcome':
                return <Button onClick={() => handleEvent('NEXT', 'Sim')}>Iniciar</Button>;
            case 'roomSelection':
                return (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <RoomSelect value={roomInput} rooms={rooms} onChange={setRoomInput} />
                        <IconButton onClick={handleSelectRoom}>
                            <IoMdSend />
                        </IconButton>
                    </Box>
                );
            case 'daySelection':
                return (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            type="date"
                            fullWidth
                            value={dateInput}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: dayjs().format('YYYY-MM-DD') }}
                            onChange={(e) => setDateInput(e.target.value)}
                        />
                        <IconButton onClick={handleSelectDate}>
                            <IoMdSend />
                        </IconButton>
                    </Box>
                );

            case 'startTimeSelection':
                return (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TimeSelect value={startInput} timeSlots={initialTimeSlots} onChange={setStartInput} />
                        <IconButton onClick={handleSelectStartTime}>
                            <IoMdSend />
                        </IconButton>
                    </Box>
                );
            case 'endTimeSelection':
                return (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TimeSelect value={endInput} timeSlots={initialEndTimeSlots} onChange={setEndInput} />
                        <IconButton onClick={handleSelectEndTime}>
                            <IoMdSend />
                        </IconButton>
                    </Box>
                );
            case 'peopleNumberSelection':
                return (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField type="number" fullWidth value={peopleInput} onChange={(e) => setPeopleInput(e.target.value)} />
                        <IconButton onClick={handleSelectPeopleNumber}>
                            <IoMdSend />
                        </IconButton>
                    </Box>
                );
            case 'eventNameSelection':
                return (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField multiline rows={1} fullWidth placeholder="Nome do evento" value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
                        <IconButton onClick={() => handleSelect('Nome do evento', nameInput, 'SUBMIT_EVENT_NAME')}>
                            <IoMdSend />
                        </IconButton>
                    </Box>
                );
            case 'eventTopicSelection':
                return (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField multiline rows={1} fullWidth placeholder="Assunto" value={topicInput} onChange={(e) => setTopicInput(e.target.value)} />
                        <IconButton onClick={() => handleSelect('Assunto', topicInput, 'SUBMIT_EVENT_TOPIC')}>
                            <IoMdSend />
                        </IconButton>
                    </Box>
                );
            case 'eventMinistrySelection':
                return (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField multiline rows={1} fullWidth placeholder="Ministério" value={ministryInput} onChange={(e) => setMinistryInput(e.target.value)} />
                        <IconButton onClick={() => handleSelect('Ministério', ministryInput, 'SUBMIT_EVENT_MINISTRY')}>
                            <IoMdSend />
                        </IconButton>
                    </Box>
                );
            case 'eventRecurrenceSelection':
                return (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            multiline
                            rows={1}
                            fullWidth
                            placeholder='Informe o período ou "Não"'
                            value={recurrenceInput}
                            onChange={(e) => setRecurrenceInput(e.target.value)}
                        />
                        <IconButton onClick={() => handleSelect('Recorrência', recurrenceInput, 'SUBMIT_EVENT_RECURRENCE')}>
                            <IoMdSend />
                        </IconButton>
                    </Box>
                );
            case 'contactPhone': {
                const isInvalid = contactPhoneInput && typeof contactPhoneInput === 'object' && typeof contactPhoneInput.valid === 'function' && !contactPhoneInput.valid(true);

                return (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <PhoneInput
                                value={contactPhoneInput}
                                onChange={(val) => {
                                    setContactPhoneInput(val);
                                    setIsNameLocked(false);
                                }}
                                label="Telefone"
                                variant="outlined"
                                fullWidth
                            />
                            {isInvalid && <FormHelperText error>Número inválido</FormHelperText>}
                        </Box>
                        <IconButton onClick={handleSubmitContactPhone}>
                            <IoMdSend />
                        </IconButton>
                    </Box>
                );
            }

            case 'contactName':
                return (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField multiline rows={1} fullWidth placeholder="Nome" value={reserverNameInput} onChange={(e) => setReserverNameInput(e.target.value)} />
                        <IconButton onClick={handleSubmitContactName}>
                            <IoMdSend />
                        </IconButton>
                    </Box>
                );
            case 'confirmReservation':
                return (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="contained" onClick={handleConfirmReservation}>
                            Confirmar!
                        </Button>
                        <Button variant="outlined" onClick={() => handleEvent('EDIT', 'Corrigir')}>
                            Corrigir
                        </Button>
                    </Box>
                );
            case 'editChoice':
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button onClick={() => handleEvent('SELECT_SALA', 'Editar Sala')}>Sala</Button>
                        <Button onClick={() => handleEvent('SELECT_DATE', 'Editar Data')}>Data</Button>
                        <Button onClick={() => handleEvent('SELECT_START', 'Editar Início')}>Início</Button>
                        <Button onClick={() => handleEvent('SELECT_END', 'Editar Término')}>Término</Button>
                        <Button onClick={() => handleEvent('SELECT_NUMBER', 'Editar Pessoas')}>Pessoas</Button>
                        <Button onClick={() => handleEvent('SUBMIT_EVENT_NAME', 'Editar Nome')}>Nome do evento</Button>
                        <Button onClick={() => handleEvent('SUBMIT_EVENT_TOPIC', 'Editar Assunto')}>Assunto</Button>
                        <Button onClick={() => handleEvent('SUBMIT_EVENT_MINISTRY', 'Editar Ministério')}>Ministério</Button>
                        <Button onClick={() => handleEvent('SUBMIT_EVENT_RECURRENCE', 'Editar Recorrência')}>Recorrência</Button>
                        <Button onClick={() => handleEvent('EDIT_CONTACT_PHONE', 'Editar telefone')}>Telefone</Button>
                        {!isNameLocked && <Button onClick={() => handleEvent('EDIT_CONTACT_NAME', 'Editar nome')}>Nome</Button>}
                    </Box>
                );
            case 'done':
                return (
                    <Box>
                        <strong>Sua reserva está em análise!</strong>
                        <Box component="p" sx={{ m: 0, mt: 0.5, color: 'text.primary' }}>
                            Em breve enviaremos um e-mail com a confirmação ou com mais detalhes. Fique de olho na sua caixa de entrada (e na pasta de spam).
                        </Box>
                    </Box>
                );
            default:
                return null;
        }
    };

    const receivedBg = '#FFFFFF';
    const sentBg = '#DCF8C6';

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 400,
                height: '91vh',
                mx: 'auto',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Paper
                ref={containerRef}
                sx={{
                    flexGrow: 1,
                    p: 2,
                    overflowY: 'auto',
                    backgroundImage: `url(${chatBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {messages.map((m, i) => (
                    <Box
                        key={i}
                        sx={{
                            display: 'flex',
                            justifyContent: m.from === 'bot' ? 'flex-start' : 'flex-end',
                            mb: 1
                        }}
                    >
                        <Box
                            sx={{
                                p: 1,
                                bgcolor: m.from === 'bot' ? receivedBg : sentBg,
                                color: '#000',
                                borderRadius: 1,
                                whiteSpace: 'pre-wrap',
                                maxWidth: '80%'
                            }}
                        >
                            {m.text}
                        </Box>
                    </Box>
                ))}
                {isTyping && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                        <Box
                            sx={{
                                p: 1,
                                bgcolor: 'grey.200',
                                borderRadius: 1,
                                display: 'flex',
                                gap: 0.5
                            }}
                        >
                            {[0, 1, 2].map((d) => (
                                <Box
                                    key={d}
                                    sx={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        bgcolor: 'grey.500',
                                        animation: `blink 1s ${d * 0.2}s infinite`,
                                        '@keyframes blink': {
                                            '0%, 100%': { opacity: 0.3 },
                                            '50%': { opacity: 1 }
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </Paper>
            <Box sx={{ p: 2 }}>{renderWidget()}</Box>
        </Box>
    );
};

export default Chat;
