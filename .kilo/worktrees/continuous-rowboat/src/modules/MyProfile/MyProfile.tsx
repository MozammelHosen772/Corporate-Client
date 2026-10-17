"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getInitials } from "@/lib/formatters";
import { updateMyProfile } from "@/services/auth/auth.service";
import { UserInfo } from "@/types/user.interface";
import { toast } from "sonner";

import {
  Camera,
  Check,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";

import { clientActionErrorModal } from "@/lib/clientActionErrorModal";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition } from "react";

interface MyProfileProps {
  userInfo: UserInfo;
}

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Administrator",
  MODERATOR: "Moderator",
  USER: "User",
};

export const MyProfile = ({ userInfo }: MyProfileProps) => {
  const [isPending, startTransition] = useTransition();

  const [saved, setSaved] = useState(false);

  // image states
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // form states
  const [name, setName] = useState(userInfo.name || "");
  const [email, setEmail] = useState(userInfo.email || "");
  const [phone, setPhone] = useState(userInfo.phone || ""); // ← নতুন
  const [gender, setGender] = useState(userInfo.gender || "");
  const [address, setAddress] = useState(userInfo.address || "");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ── phone/email — যেটা প্রথমবার registration এ সেট হয়ে গেছে সেটা lock
  // থাকবে; যেটা খালি ছিল (Google দিয়ে সাইনআপ করলে phone, phone দিয়ে
  // সাইনআপ করলে email) সেটা একবার অ্যাড করার পর server থেকে refresh
  // হয়ে userInfo.email/phone সেট হয়ে যাবে, তখন এটাও lock হয়ে যাবে ──────
  const isPhoneLocked = Boolean(userInfo.phone);
  const isEmailLocked = Boolean(userInfo.email);

  // image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  // form changed check
  const isChanged = useMemo(() => {
    return (
      name !== (userInfo.name || "") ||
      (!isEmailLocked && email !== (userInfo.email || "")) ||
      (!isPhoneLocked && phone !== (userInfo.phone || "")) ||
      gender !== (userInfo.gender || "") ||
      address !== (userInfo.address || "") ||
      selectedFile !== null
    );
  }, [
    name,
    email,
    phone,
    gender,
    address,
    selectedFile,
    userInfo,
    isEmailLocked,
    isPhoneLocked,
  ]);

  // submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isChanged) return;

    const formData = new FormData();

    // append only changed values
    if (name !== (userInfo.name || "")) {
      formData.append("name", name);
    }

    // email শুধু তখনই পাঠানো হবে যদি এটা lock না থাকে (প্রথমবার অ্যাড করা হচ্ছে)
    if (!isEmailLocked && email !== (userInfo.email || "")) {
      formData.append("email", email);
    }

    // phone শুধু তখনই পাঠানো হবে যদি এটা lock না থাকে (প্রথমবার অ্যাড করা হচ্ছে)
    if (!isPhoneLocked && phone !== (userInfo.phone || "")) {
      formData.append("phone", phone);
    }

    if (gender !== (userInfo.gender || "")) {
      formData.append("gender", gender);
    }

    if (address !== (userInfo.address || "")) {
      formData.append("address", address);
    }

    // only append image if changed
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    const toastId = toast.loading("Saving your profile...");

    startTransition(async () => {
      try {
        const result = await updateMyProfile(formData);

        if (result.success) {
          toast.success(result.message || "Profile updated successfully", {
            id: toastId,
            description: "Your changes have been saved.",
          });

          setSaved(true);

          setTimeout(() => {
            setSaved(false);
          }, 2000);

          // reset image state
          setPreviewImage(null);
          setSelectedFile(null);

          // clear input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
            router.refresh();
          }
        } else {
          toast.error(result.message || "Failed to update profile", {
            id: toastId,
            description: "Please check your details and try again.",
          });
        }
      } catch (error) {
        if (clientActionErrorModal(error)) {
          toast.dismiss(toastId); // ✅ loading toast সরাও
          return;
        }

        toast.error("Something went wrong", {
          id: toastId,
          description: "An unexpected error occurred. Please try again.",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        {/* LEFT */}
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
            {/* banner */}
            <div className="relative h-28 overflow-visible rounded-t-xl bg-gradient-to-r from-orange-700 via-orange-500 to-orange-400">
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <div className="relative">
                  {/* ring */}
                  <div className="rounded-full bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400 p-[4px] shadow-xl">
                    <Avatar className="h-24 w-24 rounded-full bg-background">
                      {previewImage || userInfo.profilePicture ? (
                        <AvatarImage
                          src={
                            previewImage || (userInfo.profilePicture as string)
                          }
                          alt={userInfo.name}
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback className="text-2xl font-semibold">
                          {getInitials(userInfo.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>

                  {/* upload button */}
                  <label
                    htmlFor="file"
                    className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-background bg-orange-500 text-white shadow-md transition-all hover:scale-105 hover:bg-orange-600"
                  >
                    <Camera className="h-4 w-4" />

                    <Input
                      ref={fileInputRef}
                      id="file"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isPending}
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* profile */}
            <div className="px-5 pb-6 pt-16">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-foreground">
                  {name || userInfo.name}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Welcome back 👋
                </p>

                <Badge
                  variant="outline"
                  className="mt-3 gap-1 border-orange-200 bg-orange-50 px-3 py-1 text-xs text-orange-700 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-400"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {ROLE_LABEL[userInfo.role] ?? userInfo.role}
                </Badge>
              </div>

              <div className="my-5 h-px bg-border" />

              <div className="space-y-3">
                {[
                  {
                    icon: Phone,
                    label: "Phone",
                    value: phone || "No phone added",
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    value: email || "No email added",
                  },
                  {
                    icon: MapPin,
                    label: "Address",
                    value: address || "No address added",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/40 p-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        {label}
                      </p>

                      <p className="truncate text-sm font-medium text-foreground">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* notice */}
          <div className="flex gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950/20">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400">
              <Lock className="h-4 w-4" />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                Security notice
              </h4>

              <p className="mt-1 text-xs leading-relaxed text-orange-600 dark:text-orange-400">
                {isPhoneLocked && isEmailLocked
                  ? "Your phone number and email are protected and cannot be changed from here."
                  : isPhoneLocked
                    ? "Your phone number is protected. You can add an email once — after that it will also be locked."
                    : "Your email is protected. You can add a phone number once — after that it will also be locked."}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="rounded-2xl border border-border bg-background shadow-sm">
          <div className="p-5 sm:p-7">
            {/* header */}
            <div className="mb-7 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400">
                <User className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Personal information
                </h2>

                <p className="text-sm text-muted-foreground">
                  Update your account details and profile
                </p>
              </div>
            </div>

            {/* basic */}
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Basic details
              </p>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>

                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    disabled={isPending}
                  />
                </div>

                {/* phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>

                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={isPhoneLocked ? "" : "Add a phone number"}
                      disabled={isPhoneLocked || isPending}
                      className={isPhoneLocked ? "pr-10" : ""}
                    />

                    {isPhoneLocked && (
                      <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    )}
                  </div>

                  {isPhoneLocked ? (
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3 shrink-0" />
                      Phone number can&apos;t be changed once set
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      You can add this once — it will be locked after saving
                    </p>
                  )}
                </div>

                {/* email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>

                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={isEmailLocked ? "" : "Add an email address"}
                      disabled={isEmailLocked || isPending}
                      className={isEmailLocked ? "pr-10" : ""}
                    />

                    {isEmailLocked && (
                      <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    )}
                  </div>

                  {isEmailLocked ? (
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3 shrink-0" />
                      Email can&apos;t be changed once set
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      You can add this once — it will be locked after saving
                    </p>
                  )}
                </div>

                {/* gender */}
                <div className="space-y-2">
                  <Label>Gender</Label>

                  <Select
                    value={gender}
                    onValueChange={setGender}
                    disabled={isPending}
                  >
                    <SelectTrigger className="h-10 w-full rounded-lg">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>

                      <SelectItem value="FEMALE">Female</SelectItem>

                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* additional */}
            <div>
              <div className="my-7 h-px bg-border" />

              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Additional info
              </p>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>

                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full address"
                    disabled={isPending}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>

            {/* button */}
            <div className="mt-8 flex justify-end">
              <Button
                type="submit"
                disabled={!isChanged || isPending}
                className={`h-11 rounded-xl px-6 text-sm font-medium transition-all ${
                  saved
                    ? "bg-green-600 hover:bg-green-600"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
