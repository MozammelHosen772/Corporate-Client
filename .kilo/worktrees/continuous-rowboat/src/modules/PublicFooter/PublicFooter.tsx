"use client";

import {
  getSocialMedia,
  ISocialMediaPublic,
} from "@/services/settings/socialMedia.service";
import { useEffect, useState } from "react";
import PublicFooterClient from "./components/PublicFooterClient";

export default function PublicFooter() {
  const [socialMedia, setSocialMedia] = useState<ISocialMediaPublic | null>(
    null,
  );

  useEffect(() => {
    const loadData = async () => {
      const data = await getSocialMedia();
      setSocialMedia(data);
    };

    loadData();
  }, []);

  return <PublicFooterClient socialMedia={socialMedia} />;
}
