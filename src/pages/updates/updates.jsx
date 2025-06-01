import { Grid, Typography, Card, CardContent, CardActions, Button } from '@mui/material';
import LoggedLayout from '../../common/layouts/loggedLayout/loggedLayout';

const Updates = () => {
    return (
        <LoggedLayout>
            <Grid container display="flex" flexDirection="column" spacing={3}>
                <Grid item>
                    <Typography variant="h4" gutterBottom>
                        Upsells Recorrentes
                    </Typography>
                    <Card>
                        <CardContent>
                            <img src="premium-plan-image.jpg" alt="Planos Premium" style={{ width: '100%', height: 'auto' }} />
                            <Typography variant="h6">Experimente o Poder dos Planos Premium</Typography>
                            <Typography variant="body1">
                                <strong>QHoras Pro (+R$ 20/mês):</strong>
                                <ul>
                                    <li>Desbloqueie relatórios avançados para insights financeiros incríveis.</li>
                                    <li>Crie um sistema de fidelidade que encanta seus clientes.</li>
                                    <li>Compartilhe a experiência com sua equipe (multiusuário).</li>
                                </ul>
                                <strong>QHoras Enterprise (+R$ 40/mês):</strong>
                                <ul>
                                    <li>Controle múltiplos negócios com facilidade em uma única conta.</li>
                                    <li>Receba suporte VIP via WhatsApp.</li>
                                    <li>Automatize processos com fluxos personalizados no WhatsApp.</li>
                                </ul>
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary">
                                Assine e Transforme Seu Negócio
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item>
                    <Typography variant="h4" gutterBottom>
                        Ofertas Exclusivas de Venda Única
                    </Typography>
                    <Card>
                        <CardContent>
                            <img src="advanced-features-image.jpg" alt="Funcionalidades Avançadas" style={{ width: '100%', height: 'auto' }} />
                            <Typography variant="h6">Funcionalidades Avançadas para Potencializar Seu Sucesso</Typography>
                            <Typography variant="body1">
                                <strong>Templates para WhatsApp (R$ 49 único):</strong>
                                <ul>
                                    <li>Acelere suas comunicações com mensagens prontas e personalizadas.</li>
                                </ul>
                                <strong>Pacote de Relatórios (R$ 79 único):</strong>
                                <ul>
                                    <li>Obtenha relatórios detalhados para decisões estratégicas.</li>
                                </ul>
                                <strong>Configuração Premium (R$ 99 único):</strong>
                                <ul>
                                    <li>Inicie com o pé direito com nosso serviço de configuração premium.</li>
                                </ul>
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary">
                                Garanta Já o Seu
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item>
                    <Typography variant="h4" gutterBottom>
                        Cross-Sells: Potencialize Seu Serviço
                    </Typography>
                    <Card>
                        <CardContent>
                            <img src="cross-sell-image.jpg" alt="Cross-Sells" style={{ width: '100%', height: 'auto' }} />
                            <Typography variant="body1">
                                <strong>Pacotes de Créditos de Mensagens:</strong>
                                <ul>
                                    <li>Perfeito para campanhas de impacto via WhatsApp.</li>
                                </ul>
                                <strong>Pacote de Treinamento para Equipes (R$ 149 único):</strong>
                                <ul>
                                    <li>Capacite sua equipe com nosso curso online exclusivo.</li>
                                </ul>
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary">
                                Adicione ao Seu Carrinho
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item>
                    <Typography variant="h4" gutterBottom>
                        Promoções Imperdíveis para Aumentar Seu Ticket Médio
                    </Typography>
                    <Card>
                        <CardContent>
                            <img src="promotion-image.jpg" alt="Promoções" style={{ width: '100%', height: 'auto' }} />
                            <Typography variant="body1">
                                <strong>Combo Anual:</strong>
                                <ul>
                                    <li>Por apenas R$ 449/ano, tenha Plano Pro, Backup na nuvem e Automação de marketing.</li>
                                </ul>
                                <strong>Oferta por Tempo Limitado:</strong>
                                <ul>
                                    <li>Assine o plano anual e ganhe um workshop gratuito ou desconto em relatórios avançados.</li>
                                </ul>
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary">
                                Aproveite Esta Oferta Agora
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </LoggedLayout>
    );
};

export default Updates;
