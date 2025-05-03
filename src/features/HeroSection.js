"use client";

import React from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="bg-white dark:bg-slate-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Digital Innovation <span className="text-blue-600 dark:text-blue-400">Redefined</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              We build cutting-edge digital solutions that help businesses transform, scale, and succeed in today's rapidly evolving digital landscape.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/folders">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">Learn More</Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md h-72 md:h-96">
              <Image
                src="/next.svg"
                alt="Digital Innovation"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}