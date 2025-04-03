import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-t from-[#161414] via-[#1c1e1d] via-70% to-[#58742e]/5 to-90%">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">SessionAlign</h1>
        <p className="text-muted-foreground">
          AI-powered session scheduling for music creators
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="bg-[#161414] rounded-t-xl border-[#58742e] border pt-8">
            <CardTitle className="text-2xl">Creator</CardTitle>
          </CardHeader>
          <CardContent className="bg-[#0a0a0a] rounded-b-xl border-[#58742e] border border-t-0 pt-6">
            <p className="mb-6 text-gray-400">
              Find sessions, collaborate with others, and manage your schedule.
            </p>
            <Button onClick={() => navigate("/creator")} className="w-full">
              Enter as Creator
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="bg-[#161414] rounded-t-xl border-[#58742e] border pt-8">
            <CardTitle className="text-2xl">Publisher</CardTitle>
          </CardHeader>
          <CardContent className="bg-[#0a0a0a] rounded-b-xl border-[#58742e] border border-t-0 pt-6">
            <p className="mb-6 text-gray-400">
              Manage writers, schedule sessions, and track collaborations.
            </p>
            <Button onClick={() => navigate("/publisher")} className="w-full">
              Enter as Publisher
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
