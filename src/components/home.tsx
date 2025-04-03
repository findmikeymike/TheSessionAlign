import React from "react";
import DashboardHeader from "@/components/DashboardHeader";
import CalendarView from "@/components/dashboard/CalendarView";
import SessionsList from "@/components/dashboard/SessionsList";
import PreferencesPanel from "@/components/dashboard/PreferencesPanel";
import PublisherView from "@/components/dashboard/PublisherView";

interface HomeProps {
  userType?: "publisher" | "writer";
  userName?: string;
  userAvatar?: string;
}

const Home = ({
  userType = "publisher",
  // Changed default to publisher to show AI matching feature
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
}: HomeProps) => {
  const [showPreferences, setShowPreferences] = React.useState(false);
  const [showApprovals, setShowApprovals] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#161414] via-[#1c1e1d] via-70% to-[#58742e]/5 to-90%">
      <DashboardHeader
        userName={userName}
        userAvatar={userAvatar}
        onSettingsClick={() => setShowPreferences(true)}
        isPublisher={userType === "publisher"}
        onApprovalsClick={() => setShowApprovals(true)}
      />

      <main className="h-[calc(100vh-72px)]">
        {userType === "publisher" ? (
          <div className="flex h-full">
            <div className="flex-1 p-6">
              <PublisherView />
            </div>
            <SessionsList />
          </div>
        ) : (
          <div className="flex h-full">
            <div className="flex-1 p-6">
              <CalendarView />
            </div>
            <SessionsList />
          </div>
        )}
      </main>

      <PreferencesPanel
        open={showPreferences}
        onOpenChange={setShowPreferences}
      />
    </div>
  );
};

export default Home;
