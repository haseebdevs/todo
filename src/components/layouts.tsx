import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  sectionClassName?: string;
  isContainer?: boolean;
  containerClassName?: string;
  children: ReactNode;
}

export const Section = ({
  sectionClassName,
  isContainer = true,
  containerClassName,
  children,
}: SectionProps) => {
  return (
    <section className={cn(sectionClassName, "min-h-screen")}>
      <div className={cn(containerClassName, `${isContainer && "container"}`)}>
        {children}
      </div>
    </section>
  );
};
