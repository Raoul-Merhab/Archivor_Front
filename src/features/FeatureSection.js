"use client";

import React from 'react';
import Image from 'next/image';
import Card from '@/components/ui/Card';

export default function FeatureSection() {
  const features = [
    {
      id: 1,
      title: "Innovative Solutions",
      description: "Transform your business with cutting-edge digital solutions tailored to your specific needs.",
      icon: "/file.svg"
    },
    {
      id: 2,
      title: "Global Reach",
      description: "Extend your market presence worldwide with our scalable applications and services.",
      icon: "/globe.svg"
    },
    {
      id: 3,
      title: "User-Friendly Interface",
      description: "Intuitive designs that prioritize user experience and simplify complex tasks.",
      icon: "/window.svg"
    }
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Featured Services</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Discover how InnovDigital can help transform your ideas into reality with our comprehensive digital solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.id} className="flex flex-col items-center text-center h-full">
              <div className="mb-4 p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                <Image 
                  src={feature.icon} 
                  alt={feature.title} 
                  width={40} 
                  height={40} 
                  className="text-blue-600 dark:text-blue-400" 
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}