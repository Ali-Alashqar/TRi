// Chatbot message endpoint with keyword-based matching (FREE)
// Replace the existing /api/chatbot/message endpoint in server.js with this code

app.post('/api/chatbot/message', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Check if chatbot is enabled
    const siteData = await SiteData.findOne();
    if (!siteData.chatbot || !siteData.chatbot.enabled) {
      return res.json({ response: 'عذراً، الشات بوت غير متاح حالياً.' });
    }

    // Load knowledge base
    const knowledgeBase = JSON.parse(fs.readFileSync(path.join(__dirname, 'chatbot-knowledge.json'), 'utf8'));
    
    // Normalize message for better matching
    const normalizedMessage = message.toLowerCase().trim();
    
    // Find matching category based on keywords
    let bestMatch = null;
    let highestScore = 0;
    
    for (const [category, data] of Object.entries(knowledgeBase)) {
      if (category === 'default') continue;
      
      const keywords = data.keywords || [];
      let score = 0;
      
      // Count matching keywords
      for (const keyword of keywords) {
        if (normalizedMessage.includes(keyword.toLowerCase())) {
          score++;
        }
      }
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = data.response;
      }
    }
    
    // Return best match or default response
    const response = bestMatch || knowledgeBase.default.response;
    res.json({ response });
    
  } catch (error) {
    console.error('Chatbot error:', error);
    res.json({
      response: 'عذراً، أنا غير قادر على الإجابة في الوقت الحالي. يرجى الاتصال بالجامعة على الرقم 0798877440 للمساعدة.',
    });
  }
});

