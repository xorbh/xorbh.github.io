/**
* Template Name: Vesperr
* Template URL: https://bootstrapmade.com/vesperr-free-bootstrap-template/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  if (mobileNavToggleBtn) {
    function mobileNavToogle() {
      document.querySelector('body').classList.toggle('mobile-nav-active');
      mobileNavToggleBtn.classList.toggle('bi-list');
      mobileNavToggleBtn.classList.toggle('bi-x');
    }
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }

  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Navmenu Scrollspy
   */
  const navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      const section = document.querySelector(navmenulink.hash);
      if (!section) return;
      const position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }

  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Load and display chat conversations
   */
  async function loadConversations() {
    try {
      const response = await fetch('/assets/data/conversations.json');
      const conversations = await response.json();
      
      document.querySelectorAll('.see-demo-btn').forEach(button => {
        button.addEventListener('click', function() {
          const agentId = this.dataset.agent;
          const conversation = conversations[agentId];
          if (!conversation) {
            console.error(`No conversation found for agent: ${agentId}`);
            return;
          }

          const agentCard = this.closest('.agent-card');
          const agentInfo = agentCard.querySelector('.agent-info');
          const agentDemo = agentCard.querySelector('.agent-demo');
          const chatWindow = agentDemo.querySelector('.chat-window');
          
          // Clear previous messages
          chatWindow.innerHTML = '';
          
          // Create chat type selector
          if (conversation.chats) {
            const chatSelector = document.createElement('div');
            chatSelector.className = 'chat-type-selector';
            chatSelector.innerHTML = `
              <button class="chat-type-btn active" data-chat="direct">💬 Chat with ${agentId.charAt(0).toUpperCase() + agentId.slice(1)}</button>
              <button class="chat-type-btn" data-chat="monitoring">📊 Team Monitoring</button>
            `;
            chatWindow.appendChild(chatSelector);

            // Add event listeners to chat type buttons
            chatSelector.querySelectorAll('.chat-type-btn').forEach(btn => {
              btn.addEventListener('click', function() {
                const chatType = this.dataset.chat;
                chatSelector.querySelectorAll('.chat-type-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                displayMessages(conversation.chats[chatType].messages);
              });
            });

            // Display initial messages (direct chat)
            displayMessages(conversation.chats.direct.messages);
          } else {
            // Handle old conversation format
            displayMessages(conversation.messages);
          }

          function displayMessages(messages) {
            const messagesContainer = chatWindow.querySelector('.messages-container') || document.createElement('div');
            messagesContainer.className = 'messages-container';
            messagesContainer.innerHTML = '';
            chatWindow.appendChild(messagesContainer);

            messages.forEach((msg, index) => {
              setTimeout(() => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `chat-message ${msg.sender}`;
                messageDiv.innerHTML = `
                  ${msg.sender === 'agent' ? `
                    <div class="agent-avatar">
                      <img src="assets/img/agents/${agentId === 'alex' ? 'Alex.jpeg' : 
                                                   agentId === 'arun' ? 'Jamie.jpg' : 
                                                   agentId === 'jhansi' ? 'Jhansi.jpg' : 
                                                   'Meghna.jpg'}" 
                           alt="${agentId}">
                    </div>
                  ` : ''}
                  <div class="message-content">
                    <p>${msg.text}</p>
                    <span class="message-timestamp">${msg.timestamp}</span>
                  </div>
                `;
                messagesContainer.appendChild(messageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
              }, index * 1000);
            });
          }

          // Show demo section
          agentInfo.classList.add('slide-out');
          setTimeout(() => {
            agentInfo.style.display = 'none';
            agentDemo.style.display = 'block';
            setTimeout(() => agentDemo.classList.add('slide-in'), 50);
          }, 300);
        });
      });

      // Handle "Back to Info" buttons
      document.querySelectorAll('.back-to-info-btn').forEach(button => {
        button.addEventListener('click', function() {
          const agentCard = this.closest('.agent-card');
          const agentInfo = agentCard.querySelector('.agent-info');
          const agentDemo = agentCard.querySelector('.agent-demo');
          
          agentDemo.classList.remove('slide-in');
          setTimeout(() => {
            agentDemo.style.display = 'none';
            agentInfo.style.display = 'block';
            setTimeout(() => agentInfo.classList.remove('slide-out'), 50);
          }, 300);
        });
      });

    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  }

  // Call loadConversations when document is ready
  document.addEventListener('DOMContentLoaded', loadConversations);

  // Add this to your existing main.js
  document.addEventListener('DOMContentLoaded', function() {
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'visual-overlay';
    document.body.appendChild(overlay);

    // Handle image clicks
    const visualItems = document.querySelectorAll('.visual-item');
    visualItems.forEach(item => {
      item.addEventListener('click', function() {
        if (!this.classList.contains('expanded')) {
          // Expand image
          this.classList.add('expanded');
          overlay.classList.add('active');
        }
      });
    });

    // Close on overlay click
    overlay.addEventListener('click', function() {
      const expandedItem = document.querySelector('.visual-item.expanded');
      if (expandedItem) {
        expandedItem.classList.remove('expanded');
        overlay.classList.remove('active');
      }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const expandedItem = document.querySelector('.visual-item.expanded');
        if (expandedItem) {
          expandedItem.classList.remove('expanded');
          overlay.classList.remove('active');
        }
      }
    });
  });

  // Samantha's LinkedIn Quote
  document.addEventListener('DOMContentLoaded', function() {
    const samanthaLink = document.querySelector('.samantha-linkedin');
    const quotePopup = document.getElementById('samantha-quote');
    const closeButton = quotePopup.querySelector('.close-quote');

    samanthaLink.addEventListener('click', function(e) {
      e.preventDefault();
      quotePopup.classList.add('active');
    });

    closeButton.addEventListener('click', function() {
      quotePopup.classList.remove('active');
    });

    quotePopup.addEventListener('click', function(e) {
      if (e.target === quotePopup) {
        quotePopup.classList.remove('active');
      }
    });
  });

})();