// JavaScript para o envio de mensagem (mantido do seu código anterior)
const sendMessageBtn = document.getElementById('send-message-btn');
const successMessageDiv = document.getElementById('success-message');

if (sendMessageBtn) {
    sendMessageBtn.addEventListener('click', function() {
        const messageInput = document.getElementById('message-input');
        // const messageText = messageInput ? messageInput.value : ''; // Se quiser pegar o texto da mensagem

        successMessageDiv.style.display = 'block';

        if (messageInput) {
            messageInput.value = ''; // Limpa o campo de texto
        }

        setTimeout(() => {
            successMessageDiv.style.display = 'none';
        }, 3000);
    });
}

// Seu código original do modal (se ainda for relevante e tiver os elementos HTML para ele)
const converseBtn = document.getElementById('converse-btn');
const modal = document.getElementById('converse-modal');
const closeBtn = document.getElementById('close-btn');

if (converseBtn) {
    converseBtn.onclick = function() {
        if (modal) {
            modal.style.display = "flex";
        }
    }
}

if (closeBtn) {
    closeBtn.onclick = function() {
        if (modal) {
            modal.style.display = "none";
        }
    }
}

window.onclick = function(event) {
    if (modal && event.target === modal) {
        modal.style.display = "none";
    }
}


// NOVO CÓDIGO PARA O FAQ
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os itens de pergunta do FAQ
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Encontra o item FAQ pai (o .faq-item)
            const faqItem = this.closest('.faq-item');

            // Alterna a classe 'active' no faq-item
            // Se já tiver a classe 'active', remove; se não tiver, adiciona.
            faqItem.classList.toggle('active');

            // Pega a div da resposta dentro deste item FAQ
            const faqAnswer = faqItem.querySelector('.faq-answer');

            // Ajusta a altura da resposta para animar a abertura/fechamento
            if (faqItem.classList.contains('active')) {
                // Se o item está ativo, define a max-height para a altura real do conteúdo
                // Isso permite a transição suave
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
            } else {
                // Se o item não está ativo, define a max-height para 0 para esconder
                faqAnswer.style.maxHeight = '0';
            }
        });
    });
});