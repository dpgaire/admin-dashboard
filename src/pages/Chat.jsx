import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { Send, Loader2, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { chatAPI } from "../services/api";
import { chatSchema } from "../utils/validationSchemas";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(chatSchema),
  });

  const mutation = useMutation({
    mutationFn: chatAPI.create,
    onSuccess: (response) => {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: response.data.response,
          timestamp: format(new Date(), "hh:mm a"),
        },
      ]);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to get response";
      toast.error(message);
    },
  });

  const onSubmit = (data) => {
    const query = data.query.trim();
    if (!query) return;

    setMessages((prev) => [
      ...prev,
      { from: "user", text: query, timestamp: format(new Date(), "hh:mm a") },
    ]);

    mutation.mutate({ query });
    reset();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mutation.isPending]);

  return (
    <div className="flex flex-col h-[85vh] md:h-[90vh] max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-indigo-700 dark:to-purple-700 text-white rounded-2xl shadow-md p-4">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 rounded-full p-2">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Chat Assistant</h1>
            <p className="text-xs text-white/80">Your smart conversational buddy</p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="bg-white/20 hover:bg-white/30 text-white rounded-full"
          onClick={() => setMessages([])}
        >
          Clear
        </Button>
      </div>

      {/* Chat area */}
      <Card className="flex-1 flex flex-col border-none shadow-xl rounded-3xl overflow-hidden backdrop-blur-md bg-white/70 dark:bg-gray-900/60">
        <CardContent className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-5">
            <AnimatePresence>
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-400 dark:text-gray-500 mt-12"
                >
                  👋 Start chatting — ask me anything!
                </motion.div>
              )}

              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${
                    message.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] md:max-w-[70%] p-3 rounded-2xl shadow-md ${
                      message.from === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none"
                    }`}
                  >
                    <p>{message.text}</p>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 block mt-1 text-right">
                      {message.timestamp}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {mutation.isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-2 text-gray-500 text-sm animate-pulse"
              >
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span>Assistant is typing...</span>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        {/* Input area */}
        <div className="p-3 sm:p-4 border-t dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center gap-2"
          >
            <Input
              {...register("query")}
              placeholder="Type your message..."
              autoComplete="off"
              className="flex-1 rounded-full px-4 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus-visible:ring-2 focus-visible:ring-blue-500 transition"
            />
            <Button
              type="submit"
              size="icon"
              disabled={mutation.isPending}
              className="rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:scale-105 transition-transform"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
