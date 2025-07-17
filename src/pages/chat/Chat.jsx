import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, TextField, Button, MenuItem, IconButton } from '@mui/material';
import { IoMdSend } from 'react-icons/io';
import { useMachine } from '@xstate/react';
import { createMachine } from 'xstate';

import chatBg from 'src/assets/images/chat-background.jpg';

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
        eventRecurrenceSelection: { on: { SUBMIT_EVENT_RECURRENCE: 'confirmReservation' } },
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
                SUBMIT_EVENT_RECURRENCE: 'eventRecurrenceSelection'
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
    eventRecurrenceSelection: 'O evento será recorrente? Se sim, informe o período, senão digite "Não".',
    confirmReservation: 'Confira todos os dados e confirme:'
};

const RoomSelect = ({ value, onChange }) => (
    <TextField select fullWidth value={value} onChange={(e) => onChange(e.target.value)}>
        <MenuItem value="Sala A">Sala A</MenuItem>
        <MenuItem value="Sala B">Sala B</MenuItem>
        <MenuItem value="Sala C">Sala C</MenuItem>
    </TextField>
);

const Chat = () => {
    const [state, send] = useMachine(chatMachine);
    const [data, setData] = useState({});
    const [messages, setMessages] = useState([]);
    const [blocked, setBlocked] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const containerRef = useRef(null);

    // buffered inputs
    const [roomInput, setRoomInput] = useState('');
    const [dateInput, setDateInput] = useState('');
    const [startInput, setStartInput] = useState('');
    const [endInput, setEndInput] = useState('');
    const [peopleInput, setPeopleInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [topicInput, setTopicInput] = useState('');
    const [ministryInput, setMinistryInput] = useState('');
    const [recurrenceInput, setRecurrenceInput] = useState('');

    // auto-scroll
    useEffect(() => {
        const el = containerRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages, isTyping]);

    // show prompts + auto-advance init
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

    // summary at confirmReservation
    useEffect(() => {
        if (state.value === 'confirmReservation') {
            const summary = Object.entries(data)
                .map(([_, v]) => v)
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
                        <RoomSelect value={roomInput} onChange={setRoomInput} />
                        <IconButton onClick={() => handleSelect('Sala', roomInput, 'SELECT_ROOM')}>
                            <IoMdSend />
                        </IconButton>
                    </Box>
                );
            case 'daySelection':
                return (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField type="date" fullWidth value={dateInput} InputLabelProps={{ shrink: true }} onChange={(e) => setDateInput(e.target.value)} />
                        <IconButton onClick={() => handleSelect('Data', dateInput, 'SELECT_DATE')}>
                            <IoMdSend />
                        </IconButton>
                    </Box>
                );
            case 'startTimeSelection':
                return (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField type="time" fullWidth value={startInput} InputLabelProps={{ shrink: true }} onChange={(e) => setStartInput(e.target.value)} />
                        <IconButton onClick={() => handleSelect('Início', startInput, 'SELECT_START')}>
                            <IoMdSend />
                        </IconButton>
                    </Box>
                );
            case 'endTimeSelection':
                return (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField type="time" fullWidth value={endInput} InputLabelProps={{ shrink: true }} onChange={(e) => setEndInput(e.target.value)} />
                        <IconButton onClick={() => handleSelect('Término', endInput, 'SELECT_END')}>
                            <IoMdSend />
                        </IconButton>
                    </Box>
                );
            case 'peopleNumberSelection':
                return (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField type="number" fullWidth value={peopleInput} onChange={(e) => setPeopleInput(e.target.value)} />
                        <IconButton onClick={() => handleSelect('Pessoas', peopleInput, 'SELECT_NUMBER')}>
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
            case 'confirmReservation':
                return (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="contained" onClick={() => handleEvent('CONFIRM', 'Confirmar!')}>
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
                height: '100vh',
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
