"use client";
import {
  AlignCenter,
  AlignLeft,
  ExternalLink,
  Loader2,
  Trash2,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TSliderItem } from "@/services/settings/bannerSlider.service";
import StatusDropdown from "./StatusDropdown";

interface Props {
  sliders: TSliderItem[];
  fetching: boolean;
  onToggle: (slider: TSliderItem) => void;
  onDelete: (slider: TSliderItem) => void;
}

export default function SliderTable({
  sliders,
  fetching,
  onToggle,
  onDelete,
}: Props) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 ">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-700">
            Slider History
          </CardTitle>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-muted-foreground">
            {sliders.length} item{sliders.length !== 1 ? "s" : ""}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/60">
              <TableHead className="w-10">#</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {fetching ? (
              <TableRow>
                <TableCell colSpan={8} className="py-16 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-slate-400" />
                </TableCell>
              </TableRow>
            ) : sliders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-16 text-center text-sm text-muted-foreground"
                >
                  No sliders found. Add your first slider above.
                </TableCell>
              </TableRow>
            ) : (
              sliders.map((slider, index) => (
                <TableRow
                  key={slider.id}
                  className="group transition-colors hover:bg-slate-50/50"
                >
                  <TableCell className="text-sm text-slate-400">
                    {index + 1}
                  </TableCell>

                  {/* Image */}
                  <TableCell>
                    <div className="relative h-14 w-24 overflow-hidden rounded-lg border border-slate-200 shadow-sm">
                      <Image
                        src={slider.imageUrl}
                        alt={slider.title}
                        fill
                        sizes="(max-width: 768px) 80px, 96px"
                        className="object-cover transition group-hover:scale-105"
                      />
                    </div>
                  </TableCell>

                  {/* Title */}
                  <TableCell className="max-w-[160px]">
                    <p className="truncate text-sm font-medium text-slate-700">
                      {slider.title}
                    </p>
                  </TableCell>

                  {/* Position */}
                  <TableCell>
                    <div
                      className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        slider.position === "center"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-purple-50 text-purple-600"
                      }`}
                    >
                      {slider.position === "center" ? (
                        <AlignCenter className="h-3 w-3" />
                      ) : (
                        <AlignLeft className="h-3 w-3" />
                      )}
                      {slider.position === "center" ? "Center" : "Left"}
                    </div>
                  </TableCell>

                  {/* Link */}
                  <TableCell className="max-w-[140px]">
                    {slider.link ? (
                      <a
                        href={slider.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 truncate text-xs text-blue-500 hover:text-blue-700 hover:underline"
                        title={slider.link}
                      >
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{slider.link}</span>
                      </a>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <StatusDropdown slider={slider} onToggle={onToggle} />
                  </TableCell>

                  {/* Created */}
                  <TableCell className="text-xs text-slate-400">
                    {new Date(slider.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(slider)}
                        className="h-8 w-8 text-slate-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
