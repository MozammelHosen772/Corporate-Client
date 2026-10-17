"use client";

import { useEffect, useRef, useState } from "react";

function getNextMidnightBD(): Date {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());

  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);

  const year = get("year");
  const month = get("month") - 1;
  const day = get("day");

  const midnightBD = new Date(Date.UTC(year, month, day + 1, 0, 0, 0));

  midnightBD.setUTCHours(midnightBD.getUTCHours() - 6);

  return midnightBD;
}

function calcTimeLeft(endTime: Date) {
  const diff = Math.max(0, endTime.getTime() - Date.now());

  return {
    h: String(Math.floor(diff / 3600000)).padStart(2, "0"),
    m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
    s: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
    expired: diff === 0,
  };
}

export function UseCountdown(onExpired?: () => void) {
  const endTimeRef = useRef<Date | null>(null);
  const onExpiredRef = useRef(onExpired);

  const [timeLeft, setTimeLeft] = useState<{
    h: string;
    m: string;
    s: string;
  } | null>(null);

  useEffect(() => {
    onExpiredRef.current = onExpired;
  }, [onExpired]);

  useEffect(() => {
    endTimeRef.current = getNextMidnightBD();

    setTimeLeft(calcTimeLeft(endTimeRef.current));

    const id = setInterval(() => {
      const left = calcTimeLeft(endTimeRef.current!);

      if (left.expired) {
        endTimeRef.current = getNextMidnightBD();

        setTimeLeft(calcTimeLeft(endTimeRef.current));

        onExpiredRef.current?.();
      } else {
        setTimeLeft(left);
      }
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return timeLeft;
}
