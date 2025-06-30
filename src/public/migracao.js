const fs = require('fs').promises;
const fetch = require('node-fetch');

// URL base do seu Firebase Realtime Database. Verifique se está correta.
const FIREBASE_URL = 'https://dbgestao-1208c-default-rtdb.firebaseio.com';

// Função para esperar um pouco entre as requisições para não sobrecarregar a API
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function migrarDados() {
    try {
        console.log('Lendo arquivo db.json local...');
        const data = await fs.readFile('db.json', 'utf8');
        const db = JSON.parse(data);
        console.log('Arquivo lido com sucesso!');

        // Lista de todos os seus recursos (as "gavetas" de dados)
        const recursos = ['educacao', 'noticias', 'investimento', 'metas', 'gastos', 'usuarios', 'messages'];

        for (const recurso of recursos) {
            if (db[recurso] && Array.isArray(db[recurso]) && db[recurso].length > 0) {
                console.log(`\n--- Iniciando migração para o recurso: ${recurso} ---`);
                
                for (const item of db[recurso]) {
                    // O Firebase usa POST para criar um novo item com um ID único e aleatório
                    const response = await fetch(`${FIREBASE_URL}/${recurso}.json`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(item)
                    });

                    if (response.ok) {
                        console.log(`- Item "${item.titulo || item.nome || `Mensagem de ${item.author}`}" migrado com sucesso!`);
                    } else {
                        // Se falhar, mostra o status e a mensagem de erro
                        const errorBody = await response.text();
                        console.error(`- Falha ao migrar item para ${recurso}. Status: ${response.status}`);
                        console.error('  Detalhes do erro:', errorBody);
                    }
                    // Espera 100ms antes da próxima requisição para a API gratuita não bloquear
                    await wait(100);
                }
            } else {
                console.log(`\nRecurso "${recurso}" está vazio ou não existe no db.json. Pulando.`);
            }
        }
        console.log('\n✅ Migração de todos os dados concluída com sucesso!');

    } catch (error) {
        console.error('❌ Ocorreu um erro geral durante o processo de migração:', error);
    }
}

// Inicia o processo
migrarDados();