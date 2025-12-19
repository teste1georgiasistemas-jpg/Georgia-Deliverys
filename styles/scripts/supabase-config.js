// CONFIGURAÇÃO DO SUPABASE - GEORGIA DELIVERYS
// As chaves serão preenchidas depois

let supabase;

// Função para inicializar (será chamada depois)
function initSupabase(url, key) {
    supabase = window.supabase.createClient(url, key);
    console.log('Supabase conectado!');
    return supabase;
}

// Verificar se usuário está logado
async function checkLogin() {
    if (!supabase) return false;
    
    const { data: { session } } = await supabase.auth.getSession();
    return session ? true : false;
}

// Funções para usar depois
window.supabaseConfig = {
    init: initSupabase,
    checkLogin: checkLogin,
    getClient: () => supabase
};
