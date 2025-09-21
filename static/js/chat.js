// Chat Widget JavaScript

// HTML Structure
const chatWidgetHTML = `
    <div class="chat-widget">
        <div class="chat-header">
            <h2>💬 Chat Support</h2>
            <p>We're here to help you!</p>
        </div>

        <div class="chat-messages" id="chatMessages">
            <div class="message bot welcome-message">
                <div>👋 Hello! Welcome to our chat support. How can I help you today?</div>
                <div class="message-time" id="welcomeTime"></div>
            </div>
            
            <div class="typing-indicator" id="typingIndicator">
                <div class="typing-dots"></div>
            </div>
        </div>

        <div class="chat-form">
            <form class="input-container" id="chatForm">
                <input 
                    type="text" 
                    class="chat-input" 
                    id="messageInput" 
                    placeholder="Type your message..."
                    required
                    maxlength="500"
                >
                <button type="submit" class="send-btn" id="sendBtn">
                    Send
                </button>
            </form>
        </div>
    </div>
`;

// Chat Widget Class
class ChatWidget {
    constructor() {
        this.init();
    }

    init() {
        // Create widget HTML
        this.createWidget();
        
        // Initialize event listeners
        this.setupEventListeners();
        
        // Set welcome message time
        this.setWelcomeTime();
    }

    createWidget() {
        const widgetContainer = document.createElement('div');
        widgetContainer.innerHTML = chatWidgetHTML;
        document.body.appendChild(widgetContainer);

        // Get DOM elements
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.chatForm = document.getElementById('chatForm');
        this.sendBtn = document.getElementById('sendBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
    }

    setupEventListeners() {
        // Handle form submission
        this.chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit();
        });

        // Handle Enter key
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.chatForm.dispatchEvent(new Event('submit'));
            }
        });

        // Input validation feedback
        this.messageInput.addEventListener('input', (e) => {
            const remaining = 500 - e.target.value.length;
            if (remaining < 50) {
                e.target.style.borderColor = remaining < 10 ? '#dc3545' : '#ffc107';
            } else {
                e.target.style.borderColor = '#e9ecef';
            }
        });

        // Focus input
        this.messageInput.focus();
    }

    setWelcomeTime() {
        const welcomeTime = document.getElementById('welcomeTime');
        welcomeTime.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    async handleSubmit() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, true);
        
        // Clear input and disable button
        this.messageInput.value = '';
        this.sendBtn.disabled = true;
        this.sendBtn.textContent = 'Sending...';
        
        // Show typing indicator
        this.showTyping();

        try {
            // Send message to webhook
            const response = await fetch('https://s1q.app.n8n.cloud/webhook/a0346096-8293-40c4-9c03-6db5c5857a82/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    timestamp: new Date().toISOString(),
                    sessionId: this.getSessionId()
                })
            });

            this.hideTyping();

            if (response.ok) {
                const data = await response.json();
                
                // Add bot response if webhook returns one
                if (data && data.response) {
                    this.addMessage(data.response, false);
                } else if (data && data.message) {
                    this.addMessage(data.message, false);
                } else {
                    // Fallback response
                    this.addMessage('Thank you for your message! I have received it and will get back to you soon.', false);
                }
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTyping();
            
            // Show error message
            this.addMessage('Sorry, there was an error sending your message. Please try again.', false);
        } finally {
            // Re-enable send button
            this.sendBtn.disabled = false;
            this.sendBtn.textContent = 'Send';
            this.messageInput.focus();
        }
    }

    addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        
        const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageDiv.innerHTML = `
            <div>${text}</div>
            <div class="message-time">${currentTime}</div>
        `;
        
        // Insert before typing indicator
        this.chatMessages.insertBefore(messageDiv, this.typingIndicator);
        this.scrollToBottom();
    }

    showTyping() {
        this.typingIndicator.style.display = 'block';
        this.scrollToBottom();
    }

    hideTyping() {
        this.typingIndicator.style.display = 'none';
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('chatSessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('chatSessionId', sessionId);
        }
        return sessionId;
    }
}

// Initialize the chat widget when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ChatWidget();
    });
} else {
    new ChatWidget();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatWidget;
}