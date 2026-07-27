document.addEventListener('DOMContentLoaded', () => {

    // ១. មុខងារចុចលើគំរូសាររហ័សដើម្បីបញ្ចូលសារក្នុងប្រអប់ (Quick Reply Injection via Event Delegation)
    document.addEventListener('click', (e) => {
        const quickReplyBtn = e.target.closest('.quick-reply-btn');
        if (quickReplyBtn) {
            const templateText = quickReplyBtn.getAttribute('data-text');
            const activePane = quickReplyBtn.closest('.tab-pane');
            const chatTextInput = activePane ? activePane.querySelector('.chat-text-input') : null;
            
            if (chatTextInput) {
                chatTextInput.value = templateText;
                chatTextInput.focus();
            }
        }
    });

    // ២. មុខងារផ្ញើសារសាកល្បងនៅក្នុងប្រអប់សកម្ម (Simulate sending messages dynamically per active user tab)
    document.addEventListener('submit', (e) => {
        const chatInputForm = e.target.closest('.chat-input-form');
        if (chatInputForm) {
            e.preventDefault(); // ទប់ស្កាត់មិនឱ្យទំព័រដើរឡើងវិញ
            
            const activePane = chatInputForm.closest('.tab-pane');
            const chatTextInput = activePane ? activePane.querySelector('.chat-text-input') : null;
            const chatMessagesContainer = activePane ? activePane.querySelector('.chat-messages-stream') : null;

            if (chatTextInput && chatMessagesContainer) {
                const typedMsg = chatTextInput.value.trim();
                if (!typedMsg) return;

                const timeNow = new Date().toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' });
                
                // បង្កើតប្រអប់សារថ្មីខាងស្តាំ (Right Bubble)
                const bubble = document.createElement('div');
                bubble.className = "message-bubble right-bubble ms-auto";
                bubble.innerHTML = `<p class="mb-0 text-sm">${typedMsg}</p><span class="bubble-time mt-1 text-end">${timeNow}</span>`;
                
                chatMessagesContainer.appendChild(bubble);
                chatTextInput.value = "";
                
                // អូសចុះក្រោមដោយស្វ័យប្រវត្តទៅកាន់សារចុងក្រោយ
                chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
            }
        }
    });
});
// END OF FILE seller_messages.js