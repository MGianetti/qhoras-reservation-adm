// File: src/pages/configurations/tabWhatsapp/tabWhatsappManagement.jsx
// (UI para a permissão whatsapp_business_management + chamadas via infra)

import React, { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { IoRefresh, IoTrashOutline, IoAddCircleOutline } from 'react-icons/io5';

// >>> usa seu client padrão
import endpoints from '../../../infraestructure/api/endpoints.constants';
import whatsappApi from '../../../domains/whatsapp/whatsappRepository';

/**
 * Componente para provar a capacidade de GERENCIAR templates
 * (whatsapp_business_management) usando o backend.
 */

// Helpers
const CATEGORIES = ['UTILITY', 'MARKETING', 'AUTHENTICATION'];
const LANGS = [
  { code: 'pt_BR', label: 'Português (Brasil)' },
  { code: 'en_US', label: 'English (US)' }
];

export default function TabWhatsappManagement() {
  const [wabaId, setWabaId] = useState('');
  const [templateName, setTemplateName] = useState('quehoras_confirmacao_01');
  const [category, setCategory] = useState('UTILITY');
  const [language, setLanguage] = useState('pt_BR');
  const [bodyText, setBodyText] = useState('Olá, {{1}}! Seu horário para {{2}} às {{3}} está confirmado.');
  const [examplesRaw, setExamplesRaw] = useState('David, Corte de cabelo, 14:00');

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  // Console para exibir request/response no vídeo
  const [apiConsole, setApiConsole] = useState({ request: null, response: null, error: null });

  const placeholdersCount = useMemo(() => {
    const matches = bodyText.match(/\{\{\d+\}\}/g) || [];
    return matches.length;
  }, [bodyText]);

  const exampleArray = useMemo(() => {
    // usuário digita exemplos separados por vírgula
    const arr = examplesRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    return arr;
  }, [examplesRaw]);

  const buildCreatePayload = () => ({
    name: templateName,
    category,
    language,
    components: [
      {
        type: 'BODY',
        text: bodyText,
        example: { body_text: [exampleArray] }
      }
    ]
  });

  // Normaliza o retorno do makeRequest/apiService (pode ser data ou { data })
  const normalize = (res) => res?.data ?? res;

  const handleCreate = async () => {
    if (!wabaId) return setApiConsole({ request: null, response: null, error: 'Informe o WABA ID' });

    const template = buildCreatePayload();
    setLoading(true);
    setApiConsole({
      request: { method: 'POST', url: endpoints.whatsapp.templates, body: { wabaId, template } },
      response: null,
      error: null
    });

    try {
      const res = await whatsappApi.createTemplate(wabaId, template);
      const data = normalize(res);
      setApiConsole((p) => ({ ...p, response: data, error: null }));
      await handleList();
    } catch (err) {
      setApiConsole((p) => ({ ...p, error: err?.response?.data || err?.message || String(err) }));
    } finally {
      setLoading(false);
    }
  };

  const handleList = async () => {
    if (!wabaId) return setApiConsole({ request: null, response: null, error: 'Informe o WABA ID' });

    setLoading(true);
    setApiConsole({
      request: { method: 'GET', url: `${endpoints.whatsapp.templates}?wabaId=${wabaId}` },
      response: null,
      error: null
    });

    try {
      const res = await whatsappApi.listTemplates(wabaId);
      const data = normalize(res);
      const items = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : data?.data || [];
      setTemplates(items || []);
      setApiConsole((p) => ({ ...p, response: data, error: null }));
    } catch (err) {
      setApiConsole((p) => ({ ...p, error: err?.response?.data || err?.message || String(err) }));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (name) => {
    if (!wabaId) return setApiConsole({ request: null, response: null, error: 'Informe o WABA ID' });

    setLoading(true);
    setApiConsole({
      request: {
        method: 'DELETE',
        url: `${endpoints.whatsapp.templateByName(name)}?wabaId=${wabaId}`
      },
      response: null,
      error: null
    });

    try {
      const res = await whatsappApi.deleteTemplate(wabaId, name);
      const data = normalize(res);
      setApiConsole((p) => ({ ...p, response: data, error: null }));
      await handleList();
    } catch (err) {
      setApiConsole((p) => ({ ...p, error: err?.response?.data || err?.message || String(err) }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = window.localStorage.getItem('wabaId');
    if (saved) setWabaId(saved);
  }, []);

  useEffect(() => {
    if (wabaId) window.localStorage.setItem('wabaId', wabaId);
  }, [wabaId]);

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Gerenciamento de Templates (WhatsApp Business)</Typography>
      <Typography variant="body2" color="text.secondary">
        Crie, liste e exclua <em>message templates</em> via seu backend para comprovar a permissão
        <code style={{ marginLeft: 4 }}>whatsapp_business_management</code>. Mantenha o request/response
        visível para gravar o vídeo de aprovação.
      </Typography>

      {/* Seção: Configurações básicas */}
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={4}>
              <TextField
                label="WABA ID *"
                fullWidth
                value={wabaId}
                onChange={(e) => setWabaId(e.target.value)}
                placeholder="ex: 123456789012345"
              />
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <TextField
                label="Nome do Template *"
                fullWidth
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="ex: quehoras_confirmacao_01"
              />
            </Grid>

            <Grid item xs={12} md={6} lg={2}>
              <TextField select label="Categoria" fullWidth value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6} lg={2}>
              <TextField select label="Idioma" fullWidth value={language} onChange={(e) => setLanguage(e.target.value)}>
                {LANGS.map((l) => (
                  <MenuItem key={l.code} value={l.code}>
                    {l.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={`BODY (placeholders {{n}}) — detectados: ${placeholdersCount}`}
                fullWidth
                multiline
                minRows={2}
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={`Exemplos do BODY (na ordem, separados por vírgula)`}
                helperText={`Ex.: David, Corte de cabelo, 14:00 — precisa ter ${placeholdersCount} valores`}
                fullWidth
                value={examplesRaw}
                onChange={(e) => setExamplesRaw(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={handleCreate} disabled={loading} startIcon={<IoAddCircleOutline />}>
                  Criar template
                </Button>
                <Button variant="outlined" onClick={handleList} disabled={loading} startIcon={<IoRefresh />}>
                  Listar/Atualizar
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Seção: Lista */}
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="subtitle1">Templates cadastrados</Typography>
            <Tooltip title="Atualizar">
              <span>
                <IconButton onClick={handleList} disabled={loading}>
                  <IoRefresh />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Idioma</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates?.length ? (
                templates.map((t) => (
                  <TableRow key={`${t?.id || t?.name}`} hover>
                    <TableCell>{t?.name}</TableCell>
                    <TableCell>{t?.language || t?.language?.code || '-'}</TableCell>
                    <TableCell>{t?.category || '-'}</TableCell>
                    <TableCell>{t?.status || t?.state || '-'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Excluir template">
                        <span>
                          <IconButton color="error" onClick={() => handleDelete(t?.name)} disabled={loading}>
                            <IoTrashOutline />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="body2" color="text.secondary">
                      Nenhum template listado. Clique em "Listar/Atualizar".
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Seção: Console (request/response) para aparecer no vídeo */}
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Console de API
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Request
              </Typography>
              <Box component="pre" sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 2, overflow: 'auto' }}>
                {apiConsole.request ? JSON.stringify(apiConsole.request, null, 2) : '—'}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Response / Error
              </Typography>
              <Box component="pre" sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 2, overflow: 'auto' }}>
                {apiConsole.error ? JSON.stringify(apiConsole.error, null, 2) : apiConsole.response ? JSON.stringify(apiConsole.response, null, 2) : '—'}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

    </Stack>
  );
}
