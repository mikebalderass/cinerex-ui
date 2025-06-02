import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";
import { Ticket } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-primary flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={"flex flex-col gap-6"}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              {children}
              <div className="hidden md:flex items-center justify-center md:col-span-1 flex-1 bg-muted">
                <div className="flex items-center space-x-2">
                  <Ticket className="size-12 text-primary" />
                  <span className="text-4xl font-bold">CineRex</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
