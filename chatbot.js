// CODESCAPE AI Chatbot Component
(function () {
    'use strict';

    // Chatbot state
    let isOpen = false;
    let messages = [];

    // Create chatbot HTML structure
    function createChatbotHTML() {
        const chatbotContainer = document.createElement('div');
        chatbotContainer.id = 'codescape-chatbot';
        chatbotContainer.innerHTML = `
            <!-- Chatbot Toggle Button -->
            <button id="chatbot-toggle" class="chatbot-toggle" aria-label="Toggle chatbot">
                <svg id="chat-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <svg id="close-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            <!-- Chatbot Panel -->
            <div id="chatbot-panel" class="chatbot-panel">
                <!-- Header -->
                <div class="chatbot-header">
                    <div class="chatbot-header-content">
                        <div class="chatbot-avatar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="chatbot-title">CODESCAPE Assistant</h3>
                            <p class="chatbot-status">
                                <span class="status-indicator"></span>
                                Online
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Messages Container -->
                <div id="chatbot-messages" class="chatbot-messages">
                    <div class="message bot-message">
                        <div class="message-content">
                            👋 Hi! I'm the CODESCAPE Assistant. How can I help you today?
                        </div>
                    </div>
                </div>

                <!-- Quick Replies -->
                <div id="chatbot-quick-replies" class="chatbot-quick-replies">
                    <button class="quick-reply-btn" data-message="What is CODESCAPE?">What is CODESCAPE?</button>
                    <button class="quick-reply-btn" data-message="How can I contact you?">How can I contact you?</button>
                    <button class="quick-reply-btn" data-message="Tell me about your services">Your Services</button>
                </div>

                <!-- Input Area -->
                <div class="chatbot-input-area">
                    <input 
                        type="text" 
                        id="chatbot-input" 
                        class="chatbot-input" 
                        placeholder="Type your message..."
                        autocomplete="off"
                    />
                    <button id="chatbot-send" class="chatbot-send-btn" aria-label="Send message">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(chatbotContainer);
    }

    // Create chatbot styles
    function createChatbotStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #codescape-chatbot {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 9999;
                font-family: 'Inter', sans-serif;
            }

            .chatbot-toggle {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 8px 30px rgba(59, 130, 246, 0.4);
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                color: white;
                position: relative;
                overflow: hidden;
            }

            .chatbot-toggle::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%);
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .chatbot-toggle:hover {
                transform: scale(1.1) rotate(5deg);
                box-shadow: 0 12px 40px rgba(59, 130, 246, 0.6);
            }

            .chatbot-toggle:hover::before {
                opacity: 1;
            }

            .chatbot-toggle:active {
                transform: scale(0.95);
            }

            .chatbot-panel {
                position: fixed;
                bottom: 100px;
                right: 24px;
                width: 380px;
                height: 550px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                display: flex;
                flex-direction: column;
                opacity: 0;
                transform: translateY(20px) scale(0.95);
                pointer-events: none;
                transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                border: 1px solid rgba(59, 130, 246, 0.1);
                overflow: hidden;
            }

            .chatbot-panel.active {
                opacity: 1;
                transform: translateY(0) scale(1);
                pointer-events: all;
            }

            .chatbot-header {
                background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
                padding: 20px;
                border-radius: 20px 20px 0 0;
                color: white;
            }

            .chatbot-header-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .chatbot-avatar {
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid rgba(255, 255, 255, 0.3);
            }

            .chatbot-title {
                font-size: 16px;
                font-weight: 700;
                margin: 0;
                letter-spacing: 0.5px;
            }

            .chatbot-status {
                font-size: 12px;
                margin: 4px 0 0 0;
                opacity: 0.9;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .status-indicator {
                width: 8px;
                height: 8px;
                background: #10b981;
                border-radius: 50%;
                display: inline-block;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.5;
                }
            }

            .chatbot-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                background: linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%);
            }

            .chatbot-messages::-webkit-scrollbar {
                width: 6px;
            }

            .chatbot-messages::-webkit-scrollbar-track {
                background: transparent;
            }

            .chatbot-messages::-webkit-scrollbar-thumb {
                background: rgba(59, 130, 246, 0.3);
                border-radius: 3px;
            }

            .chatbot-messages::-webkit-scrollbar-thumb:hover {
                background: rgba(59, 130, 246, 0.5);
            }

            .message {
                display: flex;
                animation: messageSlideIn 0.3s ease-out;
            }

            @keyframes messageSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .message-content {
                max-width: 80%;
                padding: 12px 16px;
                border-radius: 16px;
                font-size: 14px;
                line-height: 1.5;
                word-wrap: break-word;
            }

            .bot-message .message-content {
                background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
                color: #1e3a8a;
                border-bottom-left-radius: 4px;
                border: 1px solid rgba(59, 130, 246, 0.2);
            }

            .user-message {
                justify-content: flex-end;
            }

            .user-message .message-content {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
                border-bottom-right-radius: 4px;
                box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
            }

            .chatbot-input-area {
                padding: 16px 20px;
                background: white;
                border-top: 1px solid rgba(59, 130, 246, 0.1);
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .chatbot-input {
                flex: 1;
                padding: 12px 16px;
                border: 2px solid rgba(59, 130, 246, 0.2);
                border-radius: 25px;
                font-size: 14px;
                outline: none;
                transition: all 0.3s ease;
                font-family: 'Inter', sans-serif;
            }

            .chatbot-input:focus {
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }

            .chatbot-send-btn {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }

            .chatbot-send-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
            }

            .chatbot-send-btn:active {
                transform: scale(0.95);
            }

            .chatbot-send-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            /* Quick Replies */
            .chatbot-quick-replies {
                padding: 12px 20px 8px;
                background: white;
                border-top: 1px solid rgba(59, 130, 246, 0.1);
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                animation: slideInUp 0.4s ease-out;
            }

            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .quick-reply-btn {
                padding: 8px 14px;
                background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
                border: 1px solid rgba(59, 130, 246, 0.3);
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
                color: #1e3a8a;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: 'Inter', sans-serif;
                white-space: nowrap;
            }

            .quick-reply-btn:hover {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }

            .quick-reply-btn:active {
                transform: translateY(0);
            }

            /* Mobile Responsive */
            @media (max-width: 480px) {
                .chatbot-panel {
                    width: calc(100vw - 32px);
                    right: 16px;
                    bottom: 90px;
                    height: 500px;
                }

                #codescape-chatbot {
                    right: 16px;
                    bottom: 16px;
                }

                .chatbot-toggle {
                    width: 56px;
                    height: 56px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Bot response logic
    function getBotResponse(userInput) {
        const input = userInput.toLowerCase().trim();

        // Simple response logic
        if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
            return "Hello! 👋 Welcome to CODESCAPE. How can I assist you today?";
        }

        if (input.includes('how are you')) {
            return "I'm doing great, thanks for asking! I'm here to help you with anything related to CODESCAPE. 😊";
        }

        if (input.includes('what is codescape')) {
            return "CODESCAPE is an engineering-first technology partner that transforms bold ideas into exceptional digital solutions. We combine creative innovation with technical excellence to deliver scalable, reliable, and impactful products. 🚀";
        }

        if (input.includes('project') || input.includes('work')) {
            return "We've delivered 50+ successful projects! Check out our Projects page to see our amazing work. 🚀";
        }

        if (input.includes('contact') || input.includes('reach') || input.includes('email') || input.includes('how can i contact')) {
            return "You can reach us at hello@codescape.com or call us at +91 123 456 7890. We're available 24/7 to assist you! You can also visit our Contact page to send us a message. 📧";
        }

        if (input.includes('service') || input.includes('what do you do') || input.includes('your services')) {
            return "We offer Web Development, Mobile Apps, Cloud Solutions, and AI Integration. We're your engineering-first technology partner committed to delivering innovation and excellence! 💻";
        }

        if (input.includes('career') || input.includes('job') || input.includes('hiring')) {
            return "We're always looking for talented individuals! Check out our Careers page for current opportunities. 💼";
        }

        if (input.includes('thank')) {
            return "You're welcome! Feel free to ask if you need anything else. 😊";
        }

        if (input.includes('bye') || input.includes('goodbye')) {
            return "Goodbye! Have a great day! Feel free to come back anytime. 👋";
        }

        // Default response
        return "I'm here to help! You can ask me about our projects, services, careers, or how to contact us. 🤖";
    }

    // Add message to chat
    function addMessage(text, isUser = false) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Handle send message
    function sendMessage(messageText = null) {
        const input = document.getElementById('chatbot-input');
        const message = messageText || input.value.trim();

        if (!message) return;

        // Add user message
        addMessage(message, true);
        input.value = '';

        // Simulate bot typing delay
        setTimeout(() => {
            const response = getBotResponse(message);
            addMessage(response, false);
        }, 500);
    }

    // Handle quick reply click
    function handleQuickReply(message) {
        sendMessage(message);
    }

    // Toggle chatbot
    function toggleChatbot() {
        isOpen = !isOpen;
        const panel = document.getElementById('chatbot-panel');
        const chatIcon = document.getElementById('chat-icon');
        const closeIcon = document.getElementById('close-icon');

        if (isOpen) {
            panel.classList.add('active');
            chatIcon.style.display = 'none';
            closeIcon.style.display = 'block';
            document.getElementById('chatbot-input').focus();
        } else {
            panel.classList.remove('active');
            chatIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        }
    }

    // Initialize chatbot
    function initChatbot() {
        createChatbotStyles();
        createChatbotHTML();

        // Event listeners
        document.getElementById('chatbot-toggle').addEventListener('click', toggleChatbot);
        document.getElementById('chatbot-send').addEventListener('click', () => sendMessage());
        document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Quick reply buttons
        document.querySelectorAll('.quick-reply-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                handleQuickReply(message);
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }
})();
