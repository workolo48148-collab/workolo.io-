"use client";

import { CalendarCheck, Star } from "lucide-react";
import Image from "next/image";
import { NextSlotsCard } from "@/components/booking/next-slots-card";
import { dms, reviews, reviewSummary } from "@/lib/content";
import { useTilt } from "./tilt";

type Style = React.CSSProperties & Record<`--${string}`, string | number>;

/**
 * Hero centerpiece: the live booking card floating in front of two real proof
 * screenshots at different depths. The rig follows the pointer on desktop;
 * on phones it collapses to the card alone (fast, readable, no 3D cost).
 *
 * Layout (desktop): DM peeks out top-left, review peeks out bottom-right,
 * booking card sits between them, inset from the left so both stay visible.
 */
export function ProofStack() {
  const rig = useTilt<HTMLDivElement>(5, { base: [6, -12], target: "window" });
  const dm = dms.find((d) => d.src.includes("call-request")) ?? dms[0];
  const review = reviews.find((r) => r.src.includes("facebook-ads-expert")) ?? reviews[0];

  return (
    <div className="stage-3d relative mx-auto w-full max-w-[34rem] lg:pb-28 lg:pt-24">
      <div ref={rig} className="rig-3d relative">
        {/* Back layer: a real DM asking for a call */}
        <figure
          className="layer-3d float-3d absolute -left-14 -top-28 hidden w-[17.5rem] lg:block"
          style={{ "--z": "-130px", "--rz": "-5deg", "--fd": "-2s" } as Style}
          aria-hidden
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
            <Image src={dm.src} alt="" width={dm.width} height={dm.height} sizes="280px" className="h-auto w-full" />
          </div>
        </figure>

        {/* Back layer: a real 5.0 review */}
        <figure
          className="layer-3d float-3d absolute -bottom-28 -right-2 hidden w-[17.5rem] lg:block"
          style={{ "--z": "-80px", "--rz": "4deg", "--fd": "-4.5s" } as Style}
          aria-hidden
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
            <Image src={review.src} alt="" width={review.width} height={review.height} sizes="280px" className="h-auto w-full" />
          </div>
        </figure>

        {/* Front layer: the live booking card (fully interactive) */}
        <div className="layer-3d relative lg:ml-auto lg:w-[88%]" style={{ "--z": "40px" } as Style}>
          <NextSlotsCard />
        </div>

        {/* Floating chips, placed where they never cover the card's content */}
        <div
          className="layer-3d float-3d absolute -bottom-16 left-0 hidden items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 shadow-lg lg:flex"
          style={{ "--z": "120px", "--fd": "-1s" } as Style}
          aria-hidden
        >
          <Star className="size-4 fill-current text-star" />
          <span className="text-sm font-semibold">{reviewSummary.rating}</span>
          <span className="text-sm text-muted">· {reviewSummary.count} reviews</span>
        </div>
        <div
          className="layer-3d float-3d absolute -top-5 right-4 hidden items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 shadow-lg lg:flex"
          style={{ "--z": "95px", "--fd": "-3s" } as Style}
          aria-hidden
        >
          <CalendarCheck className="size-4 text-accent" />
          <span className="text-sm font-semibold">You film 1–2 days a month</span>
        </div>
      </div>
    </div>
  );
}
