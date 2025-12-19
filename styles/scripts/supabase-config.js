// CONFIGURAÇÃO DO SUPABASE - GEORGIA DELIVERYS
// COLE SUAS CHAVES AQUI:

const SUPABASE_URL = 'https://qbdkkzukbbgqikozihjm.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiZGtrenVrYmJncWlrb3ppaGptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMDM5NTAsImV4cCI6MjA4MTY3OTk1MH0.c1Ycx_938CWAli4wAtLikewAwLpf3wUR5kaw0EEoknI'


// Inicializar Supabase automaticamente
let supabase;

// Função para iniciar o Supabase
function initSupabase() {
    if (!SUPABASE_URL.includes('SEU-ID') && !SUPABASE_ANON_KEY.includes('eyJhbGciOiJ')) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase conectado com sucesso!');
        console.log('URL:', SUPABASE_URL);
        
        // Testar conexão
        testarConexao();
        return supabase;
    } else {
        console.warn('⚠️ Configure suas chaves do Supabase primeiro!');
        console.log('Para configurar:');
        console.log('1. Vá em Settings → API no Supabase');
        console.log('2. Copie a URL e a chave "anon public"');
        console.log('3. Cole nas variáveis acima');
        return null;
    }
}

// Testar se está conectado
async function testarConexao() {
    try {
        const { data, error } = await supabase.from('products').select('count');
        if (!error) {
            console.log('✅ Conexão com banco de dados OK!');
        }
    } catch (err) {
        console.log('⚠️ Configure o banco de dados no Supabase');
    }
}

// Verificar se usuário está logado
async function checkLogin() {
    if (!supabase) return false;
    
    const { data: { session } } = await supabase.auth.getSession();
    return session ? true : false;
}

// Função para login com email/senha
async function loginUser(email, password) {
    if (!supabase) return { error: 'Supabase não configurado' };
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });
    return { data, error };
}

// Função para cadastro
async function signUpUser(email, password, name) {
    if (!supabase) return { error: 'Supabase não configurado' };
    
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                name: name,
                is_customer: true
            }
        }
    });
    return { data, error };
}

// Função para logout
async function logoutUser() {
    if (!supabase) return;
    await supabase.auth.signOut();
}

// Inicializar automaticamente quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Georgia Deliverys - Sistema Iniciando...');
    const client = initSupabase();
    
    if (client) {
        // Se conectado, mostrar notificação
        setTimeout(() => {
            mostrarNotificacao('Sistema conectado ao banco de dados!', 'success');
        }, 1000);
    } else {
        // Se não conectado, mostrar aviso
        setTimeout(() => {
            mostrarNotificacao('⚠️ Configure o Supabase para funcionalidades completas', 'warning');
        }, 1500);
    }
});

// Sistema de notificações
function mostrarNotificacao(mensagem, tipo = 'info') {
    // Criar elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'success' ? '#10B981' : tipo === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 9999;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
    `;
    
    const icone = tipo === 'success' ? 'fa-check-circle' : 
                  tipo === 'error' ? 'fa-exclamation-circle' : 
                  tipo === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    
    notificacao.innerHTML = `
        <i class="fas ${icone}"></i>
        <span>${mensagem}</span>
    `;
    
    document.body.appendChild(notificacao);
    
    // Remover após 5 segundos
    setTimeout(() => {
        notificacao.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notificacao.remove(), 300);
    }, 5000);
}

// Adicionar estilos de animação se não existirem
if (!document.querySelector('#animacoes-notificacoes')) {
    const style = document.createElement('style');
    style.id = 'animacoes-notificacoes';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Exportar funções para uso global
window.supabaseConfig = {
    init: initSupabase,
    checkLogin: checkLogin,
    login: loginUser,
    signUp: signUpUser,
    logout: logoutUser,
    getClient: () => supabase,
    mostrarNotificacao: mostrarNotificacao
};
