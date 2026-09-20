import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1",
        orientation === "vertical" && "flex-col",
        className,
      )}
      {...props}
    />
  ),
);
ButtonGroup.displayName = "ButtonGroup";

export const ButtonGroupText = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
ButtonGroupText.displayName = "ButtonGroupText";

export const ButtonGroupSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mx-1 h-4 w-px bg-border", className)} {...props} />
  ),
);
ButtonGroupSeparator.displayName = "ButtonGroupSeparator";
