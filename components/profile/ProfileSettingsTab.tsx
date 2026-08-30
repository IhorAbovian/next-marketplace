import { Card, CardContent } from "@/components/ui/card";
import ProfileSettingsForm, {
  type ProfileSettingsFormProps,
} from "@/components/ProfileSettingsForm";

export default function ProfileSettingsTab({
  initialName,
  initialPhone,
  initialAvatar,
}: ProfileSettingsFormProps) {
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
