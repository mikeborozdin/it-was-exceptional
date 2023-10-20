import { useState, useEffect } from "react";

interface Props {
  messages: string[];
  delay: number;
  className?: string;
}

const LoadingMessages: React.FC<Props> = ({ messages, delay, className }) => {
  const [message, setMessage] = useState<string>(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextMessage = messages.shift();

      if (nextMessage) {
        setMessage(nextMessage);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [message, messages, delay]);

  return <div className={className}>{message}</div>;
};

export { LoadingMessages };
