/**
 * START OF FILE seller_messages.js
 * Minimal Chat System Controllers
 */

document.addEventListener('DOMContentLoaded', () => {

    const chatUsers = document.querySelectorAll('.chat-user-item');
    const chatMessagesContainer = document.getElementById('chat-messages-container');
    const chatTextInput = document.getElementById('chat-text-input');
    const chatInputForm = document.getElementById('chat-input-form');
    const quickReplyBtns = document.querySelectorAll('.quick-reply-btn');

    // ១. មុខងារចុចលើប៊ូតុងសាររហ័សដើម្បីបញ្ចូលសារក្នុងប្រអប់ (Quick Reply Inject)
    quickReplyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const templateText = btn.getAttribute('data-text');
            if (chatTextInput) {
                chatTextInput.value = templateText;
                chatTextInput.focus();
            }
        });
    });

    // ២. មុខងារចុចប្តូរការសន្ទនារបស់អតិថិជននីមួយៗ (Chat Switching)
    chatUsers.forEach(user => {
        user.addEventListener('click', () => {
            chatUsers.forEach(u => u.classList.remove('active'));
            user.classList.add('active');

            const uName = user.querySelector('h6').textContent;
            const uAvatar = user.querySelector('img').src;
            const uBadge = user.querySelector('.badge').textContent;
            const uBadgeClass = user.querySelector('.badge').className;

            // Update UI elements dynamically
            document.getElementById('active-user-name').textContent = uName;
            document.getElementById('active-user-avatar').src = uAvatar;
            document.getElementById('context-user-name').textContent = uName;
            document.getElementById('context-avatar').src = uAvatar;
            
            const contextBadge = document.getElementById('context-user-badge');
            if (contextBadge) {
                contextBadge.textContent = uBadge;
                contextBadge.className = uBadgeClass;
            }
        });
    });

    // ៣. មុខងារផ្ញើសារសាមញ្ញ (Simple Send Message Simulation)
    if (chatInputForm) {
        chatInputForm.addEventListener('submit', () => {
            const typedMsg = chatTextInput.value.trim();
            if (!typedMsg) return;

            const timeNow = new Date().toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' });
            const bubble = document.createElement('div');
            bubble.className = "message-bubble right-bubble ms-auto";
            bubble.innerHTML = `<p class="mb-0 text-sm">${typedMsg}</p><span class="bubble-time mt-1 text-end">${timeNow}</span>`;
            
            chatMessagesContainer.appendChild(bubble);
            chatTextInput.value = "";
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        });
    }
});
// END OF FILE seller_messages.js