import { Card, CardContent } from "@/components/ui/card";
import ProfileSettingsForm from "@/components/ProfileSettingsForm";

interface ProfileSettingsTabProps {
  userId: string;
  initialName: string | null;
  initialPhone: string | null;
  initialAvatar: string | null;
}

export default function ProfileSettingsTab({
  userId,
  initialName,
  initialPhone,
  initialAvatar,
}: ProfileSettingsTabProps) {
  return (
    <Card>
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>
        <ProfileSettingsForm
          initialName={initialName || ""}
          initialPhone={initialPhone || ""}
          initialAvatar={initialAvatar}
        />
      </CardContent>
    </Card>
  );
}
