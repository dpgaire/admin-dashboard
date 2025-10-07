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
  }, [messages, mutation.isLoading]);

  return (
    <div className="flex flex-col h-[85vh]">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Chat Assistant
      </h1>

      <Card className="flex-1 flex flex-col border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
        <CardContent className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`flex flex-col ${
                    message.from === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-end gap-2 max-w-[80%]">
                    {message.from === "bot" && (
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    )}

                    <div
                      className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm relative ${
                        message.from === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted text-muted-foreground rounded-bl-none"
                      }`}
                    >
                      {message.text}
                      <span className="block text-[10px] text-gray-400 mt-1 text-right">
                        {message.timestamp}
                      </span>
                    </div>

                    {message.from === "user" && (
                      <div className="bg-primary/10 p-2 rounded-full">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator (assistant typing) */}
            {mutation.isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-2 text-gray-500 text-sm animate-pulse"
              >
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Assistant is typing...</span>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        <div className="p-4 border-t bg-background/70 backdrop-blur-sm sticky bottom-0">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center gap-2"
          >
            <Input
              {...register("query")}
              placeholder="Type your message..."
              autoComplete="off"
              className="flex-1 rounded-full px-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border-none shadow-inner focus-visible:ring-2 focus-visible:ring-primary"
            />
            <Button
              type="submit"
              size="icon"
              disabled={mutation.isLoading}
              className="rounded-full shadow-md hover:scale-105 transition-transform"
            >
              {mutation.isLoading ? (
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
