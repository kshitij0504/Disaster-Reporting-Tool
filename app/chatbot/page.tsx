'use client'
import React from 'react';
import { useState } from 'react';

const BotpressChat = () => {
  const [iframeKey, setIframeKey] = useState(0);

  // Handle any errors loading the iframe
  const handleIframeError = () => {
    console.error('Failed to load Botpress chat iframe');
    // Retry loading by updating the key which will remount the iframe
    setIframeKey(prev => prev + 1);
  };

  return (
    <div className="w-full h-screen">
      <iframe
        key={iframeKey}
        src="https://cdn.botpress.cloud/webchat/v2.3/shareable.html?configUrl=https://files.bpcontent.cloud/2024/12/18/19/20241218193212-8ASC3SLI.json"
        className="w-full h-full border-none"
        title="Botpress Chat"
        onError={handleIframeError}
        loading="lazy"
        allow="microphone"
      />
    </div>
  );
};

export default BotpressChat;