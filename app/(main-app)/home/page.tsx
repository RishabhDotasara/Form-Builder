import Home from "@/components/custom/home/home";
import withAuth from "@/hoc/auth";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
function HomePage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Loader2 className="animate-spin"/></div>}>
      <Home />
    </Suspense>
  );
}

export default HomePage;
