import { cn } from "@/lib/utils";

export function VoiceWave({ isListening }: { isListening: boolean }) {
  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div
          key={i}
          className={cn(
            "w-1 bg-primary rounded-full transition-all duration-300",
            isListening ? "animate-voice-wave" : "h-2"
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            height: isListening ? undefined : "8px",
          }}
        />
      ))}
    </div>
  );
}
