import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import * as React from "react";
export function Logo({className, size , ...props}:React.ComponentProps<any>) {
  return (
    <>
      <Link href="/" className="inline-block w-full mx-auto">
        <div
          className={cn(
            `mx-auto h-12 bg-secondary text-secondary-foreground rounded-2xl flex items-center justify-center shadow-md`,
            className,
          )}
        >
          <GraduationCap className="w-7 h-7" />
        </div>
      </Link>
    </>
  );
}
