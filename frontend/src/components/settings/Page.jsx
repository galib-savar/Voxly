import { useEffect, useState } from "react";
import Input from "../ui/Input";
import UploadIcon from "../../assets/icons/UploadIcon";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import Toast from "../ui/Toast";
import { editProfile, getProfile } from "../../api/profile";

const Page = () => {
  const [profile, setProfile] = useState(null);
  const [toast, setToast] = useState(null);
  const profileInitial = profile?.user?.name?.charAt(0) || "U";

  const showToast = (message, variant = "info") => {
    setToast({
      id: Date.now() + Math.random(),
      message,
      variant,
    });
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user)?._id : null;

    if (userId) {
      getProfile(userId).then(setProfile);
    }
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    localStorage.removeItem("user");
    showToast("Logged out successfully.", "success");
    window.location.href = "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);
      const updatedProfile = await editProfile(formData);

      if (updatedProfile) {
        setProfile(updatedProfile);
        showToast("Profile updated successfully.", "success");
        return;
      }

      showToast("Profile update failed. Please try again.", "warning");
    } catch (error) {
      showToast(
        error?.response?.data?.message ||
          "Something went wrong while updating your profile.",
        "danger",
      );
    }
  };

  return (
    <section className="flex-1">
      <form
        key={profile?._id}
        onSubmit={handleSubmit}
        className="flex flex-col gap-gap-large p-padding-large"
      >
        <div>
          <Input
            type="file"
            label={<UploadIcon />}
            id="Banner"
            name="profileBannerPhoto"
            className="w-full h-52 flex items-center justify-center rounded-radius Border hover:bg-hover cursor-pointer"
          />
          <Input
            type="file"
            label={
              <span className="h-32 w-32 bg-foreground text-background rounded-radius text-5xl flex items-center justify-center">
                {profileInitial}
              </span>
            }
            id="Logo"
            name="profileLogo"
            className="flex items-center justify-center w-32 h-32 rounded-radius Border cursor-pointer mt-margin-small bg-background hover:bg-hover"
          />
        </div>
        <div>
          <Textarea
            label="About you"
            id="bio"
            name="profileBio"
            placeholder="Write about yourself"
            defaultValue={profile?.profileBio || ""}
            maxLength={500}
          />
        </div>
        <div className="flex flex-wrap gap-gap-large">
          <Input
            type="url"
            label="Website"
            name="website"
            id="website"
            placeholder="Enter your website URL"
            defaultValue={profile?.website || ""}
          />
          <Input
            type="text"
            label="Location"
            name="location"
            id="location"
            placeholder="Enter your location"
            defaultValue={profile?.location || ""}
          />
        </div>
        <div className="flex flex-wrap gap-gap-large">
          <Input
            type="url"
            label="GitHub"
            name="github"
            id="github"
            placeholder="Enter your GitHub profile URL"
            defaultValue={profile?.github || ""}
          />
          <Input
            type="url"
            label="LinkedIn"
            name="linkedin"
            id="linkedin"
            placeholder="Enter your LinkedIn profile URL"
            defaultValue={profile?.linkedin || ""}
          />
          <Input
            type="url"
            label="Twitter"
            name="twitter"
            id="twitter"
            placeholder="Enter your Twitter profile URL"
            defaultValue={profile?.twitter || ""}
          />
        </div>
        <div className="flex gap-gap-large">
          <Button type="submit">Save Changes</Button>
          <Button type="reset">Reset</Button>
        </div>
      </form>
      <div className="flex items-center justify-between m-margin-large p-padding-large rounded-radius Border">
        <span>
          Logged in as {profile?.user?.name || "User"} ({profile?.user?.email || ""})
        </span>
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      {toast && (
        <Toast key={toast.id} variant={toast.variant}>
          {toast.message}
        </Toast>
      )}
    </section>
  );
};

export default Page;
