import React, {useEffect} from 'react';
import { Widget, addResponseMessage  } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';

function PopChat() {
  useEffect(() => {
    addResponseMessage('Welcome to cobrakai chat bot! Type in your page request and the AI will answer it to the best of its ability!');
  }, []);

  const handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
    // Now send the message throught the backend API
  };

  return (
    <div className="App">
      <Widget 
      handleNewUserMessage={handleNewUserMessage} 
      title="Hammer Challenge"
      subtitle="Testing AIChatbot"
      />
    </div>
  );
}

export default PopChat;