"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {useAuth} from "@/lib/authContext";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated]);

  return (
        <main className="flex bg-secondary flex-1 flex-col justify-center items-center px-4">
          {isAuthenticated && <p>Redirecting to dashboard...</p>}

          {!isAuthenticated &&
            <Card className="max-w-lg w-full shadow-lg">
                <CardContent className="py-8 px-6 flex flex-col items-center">
                    <h1 className="text-4xl font-bold mb-2 text-center">Track Your Time</h1>
                    <p className="text-muted-foreground text-center mb-6">Reliable and fast time registration.</p>
                    <Button className="mb-6 w-full" size="lg" asChild={true}>
                        <Link href={"/register"}>Get Started</Link>
                    </Button>
                    <Separator className="mb-6" />
                    <div className="grid grid-cols-1 gap-4 w-full">
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-primary rounded-full" />
                            <span>Start right away</span>
                        </div>
                    </div>
                </CardContent>
            </Card> }
        </main>

  );
}
