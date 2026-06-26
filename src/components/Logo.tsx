
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "icon-only" | "full";
  size?: "sm" | "md" | "lg" | "xl";
}

export function Logo({ className, variant = "full", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  const containerClasses = cn(
    "relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 glass shadow-lg",
    sizeClasses[size],
    className
  );

  return (
    <div className={containerClasses}>
      <img
        src="/logo-raw.png"
        alt="Nosky HomeOS"
        className={cn(
          "h-[85%] w-[85%] object-contain relative z-10",
          variant === "icon-only" ? "scale-90" : "scale-100"
        )}
      />
    </div>
  );
}
