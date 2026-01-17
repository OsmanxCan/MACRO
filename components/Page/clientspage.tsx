"use client"

import { Calendar, Info, Megaphone, Cpu, Plane, Cog, ExternalLink, Zap, Users, Trophy, Sparkles, ArrowRight, Bot, Wrench, Code, Rocket, Brain, Target, Award, BookOpen, Lightbulb, Globe } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/navbar';
import SanitizedContent from '@/components/SanitizedContent';
import Footer from '../Footer';
import { useButtonTracking } from '@/hooks/useButtonTracking';
import { usePageTracking } from '@/hooks/usePageTracking';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface PageProps {
  announcements: any[];
  events: any[];
  about: any;
}

export default function HomePage({ announcements, events, about }: PageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { trackClick } = useButtonTracking();

  usePageTracking({
    pageName: 'home',
    pageTitle: 'Ana Sayfa - MACRO',
    additionalData: {
      announcements_count: announcements.length,
      events_count: events.length
    }
  });

  // Custom Cursor & Mouse Follower
  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    
    const moveCursor = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      if (cursor) {
        gsap.to(cursor, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
      
      if (cursorDot) {
        gsap.to(cursorDot, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
        });
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const percentX = (clientX - centerX) / centerX;
      const percentY = (clientY - centerY) / centerY;

      gsap.to('.parallax-slow', {
        x: percentX * 50,
        y: percentY * 50,
        duration: 1,
        ease: 'power2.out'
      });

      gsap.to('.parallax-medium', {
        x: percentX * 30,
        y: percentY * 30,
        duration: 0.8,
        ease: 'power2.out'
      });

      gsap.to('.parallax-fast', {
        x: percentX * 15,
        y: percentY * 15,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from('.hero-badge', {
        opacity: 0,
        scale: 0.5,
        duration: 0.8,
        ease: 'back.out(1.7)'
      });

      gsap.from('.hero-title', {
        opacity: 0,
        y: 100,
        scale: 0.9,
        duration: 1.2,
        delay: 0.2,
        ease: 'power4.out'
      });

      gsap.from('.hero-description', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out'
      });

      gsap.from('.hero-tech-badge', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
      });

      gsap.from('.hero-cta', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 1.2,
        stagger: 0.2,
        ease: 'power2.out'
      });

      // Floating animations
      gsap.to('.float-1', {
        y: -30,
        rotation: 5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to('.float-2', {
        y: -20,
        rotation: -5,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to('.float-3', {
        y: -25,
        rotation: 3,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to('.rotate-slow', {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none'
      });

      // Scroll animations
      gsap.utils.toArray('.fade-in-up').forEach((element: any) => {
        gsap.from(element, {
          scrollTrigger: {
            trigger: element,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: 60,
          duration: 1,
          ease: 'power3.out'
        });
      });

      gsap.utils.toArray('.zoom-in').forEach((element: any) => {
        gsap.from(element, {
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
          },
          scale: 0.8,
          opacity: 0,
          duration: 1,
          ease: 'back.out(1.7)'
        });
      });

      // Stats counter
      gsap.from('.stat-number', {
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 80%',
        },
        textContent: 0,
        duration: 2,
        ease: 'power2.out',
        snap: { textContent: 1 },
        stagger: 0.2
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background ">
      {/* Custom Cursor */}
      <div 
        ref={cursorRef}
        className="hidden lg:block fixed w-8 h-8 pointer-events-none z-[9999] mix-blend-difference"
        style={{ left: '-16px', top: '-16px' }}
      >
        <div className="w-full h-full rounded-full border-2 border-white" />
      </div>
      <div 
        ref={cursorDotRef}
        className="hidden lg:block fixed w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ left: '-3px', top: '-3px' }}
      />

      <Navbar />

      {/* Hero Section - Spline Inspired */}
      <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]" />
          
          {/* Gradient Orbs */}
          <div className="parallax-slow absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/30 to-cyan-500/30 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="parallax-medium absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/30 to-pink-500/30 dark:from-purple-500/20 dark:to-pink-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="parallax-fast absolute bottom-1/4 left-1/2 w-[400px] h-[400px] bg-gradient-to-r from-pink-500/30 to-orange-500/30 dark:from-pink-500/20 dark:to-orange-500/20 rounded-full blur-[90px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Floating 3D Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="parallax-slow float-1 absolute top-20 left-[10%] opacity-20 dark:opacity-10">
            <div className="relative">
              <Cpu className="w-24 h-24 text-blue-500" />
              <div className="absolute inset-0 bg-blue-500/30 blur-xl" />
            </div>
          </div>
          
          <div className="parallax-medium float-2 absolute top-32 right-[15%] opacity-20 dark:opacity-10">
            <div className="relative rotate-slow">
              <Cog className="w-32 h-32 text-purple-500" />
              <div className="absolute inset-0 bg-purple-500/30 blur-xl" />
            </div>
          </div>
          
          <div className="parallax-fast float-3 absolute bottom-32 left-[15%] opacity-20 dark:opacity-10">
            <div className="relative">
              <Plane className="w-20 h-20 text-pink-500" />
              <div className="absolute inset-0 bg-pink-500/30 blur-xl" />
            </div>
          </div>
          
          <div className="parallax-slow float-1 absolute bottom-40 right-[10%] opacity-20 dark:opacity-10">
            <div className="relative">
              <Bot className="w-28 h-28 text-cyan-500" />
              <div className="absolute inset-0 bg-cyan-500/30 blur-xl" />
            </div>
          </div>

          <div className="parallax-medium float-2 absolute top-[40%] left-[5%] opacity-15 dark:opacity-8">
            <Rocket className="w-16 h-16 text-orange-500" />
          </div>

          <div className="parallax-fast float-3 absolute top-[50%] right-[8%] opacity-15 dark:opacity-8">
            <Brain className="w-20 h-20 text-green-500" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 mx-auto px-4 py-32">
          <div className="max-w-6xl mx-auto text-center">
            {/* Badge */}
            <div className="hero-badge inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 backdrop-blur-sm mb-8">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Isparta Uygulamalı Bilimler Üniversitesi
              </span>
            </div>

            {/* Main Title */}
            <h1 className="hero-title text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none">
              <span className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                MACRO
              </span>
            </h1>

            {/* Subtitle */}
            <div className="hero-description space-y-6 mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground/90">
                Makine • Havacılık • Bilgisayar • Robotik • Otomasyon
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Geleceğin mühendislerini yetiştiren, teknoloji ve inovasyon odaklı öğrenci topluluğu. 
                Projeler geliştirin, deneyim kazanın, networking yapın.
              </p>
            </div>

            {/* Tech Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {[
                { icon: Wrench, label: 'İş Makinaları', color: 'from-blue-500 to-cyan-500' },
                { icon: Plane, label: 'Havacılık Teknolojisi', color: 'from-purple-500 to-pink-500' },
                { icon: Code, label: 'Bilgisayar Teknolojisi', color: 'from-pink-500 to-red-500' },
                { icon: Bot, label: 'Robotik Sistemler', color: 'from-cyan-500 to-blue-500' },
                { icon: Zap, label: 'Otomasyon Teknolojileri', color: 'from-orange-500 to-yellow-500' }
              ].map((tech, i) => (
                <div 
                  key={i}
                  className="hero-tech-badge group relative"
                >
                  <div className={`relative px-5 py-3 rounded-2xl bg-gradient-to-r ${tech.color} bg-opacity-10 border border-white/10 backdrop-blur-sm hover:scale-110 hover:shadow-2xl transition-all duration-300 cursor-pointer`}>
                    <div className="flex items-center gap-2">
                      <tech.icon className="w-5 h-5 text-white" />
                      <span className="text-sm font-semibold text-white hidden md:inline">
                        {tech.label}
                      </span>
                    </div>
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${tech.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity`} />
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="#kesfet"
                onClick={() => trackClick({ 
                  buttonName: 'hero_kesfet', 
                  section: 'hero', 
                  page: 'home' 
                })}
                className="hero-cta group relative px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-lg font-bold rounded-full overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Keşfet
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              
              <a 
                href="#etkinlikler"
                onClick={() => trackClick({ 
                  buttonName: 'hero_etkinikler', 
                  section: 'hero', 
                  page: 'home' 
                })}
                className="hero-cta group px-10 py-5 bg-background/50 backdrop-blur-sm border-2 border-primary/30 text-foreground text-lg font-bold rounded-full hover:bg-primary/10 hover:border-primary/60 hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center gap-3">
                  <Calendar className="w-6 h-6" />
                  Etkinlikler
                </span>
              </a>

              <a 
                href="/kayit-ol"
                onClick={() => trackClick({ 
                  buttonName: 'hero_uye_ol', 
                  section: 'hero', 
                  page: 'home' 
                })}
                className="hero-cta group px-10 py-5 bg-background/50 backdrop-blur-sm border-2 border-green-500/30 text-foreground text-lg font-bold rounded-full hover:bg-green-500/10 hover:border-green-500/60 hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-green-500" />
                  Üye Ol
                </span>
              </a>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section relative py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: 500, suffix: '+', label: 'Aktif Üye', icon: Users, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
              { number: 75, suffix: '+', label: 'Tamamlanan Proje', icon: Trophy, color: 'purple', gradient: 'from-purple-500 to-pink-500' },
              { number: 150, suffix: '+', label: 'Etkinlik', icon: Calendar, color: 'pink', gradient: 'from-pink-500 to-red-500' },
              { number: 20, suffix: '+', label: 'Ödül', icon: Award, color: 'cyan', gradient: 'from-cyan-500 to-blue-500' }
            ].map((stat, i) => (
              <div 
                key={i}
                className="zoom-in group relative"
              >
                <div className="relative p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:scale-110 hover:shadow-2xl overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <div className="relative">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                      <span className="stat-number">{stat.number}</span>{stat.suffix}
                    </div>
                    <div className="text-sm md:text-base text-muted-foreground font-semibold">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Why MACRO - Features Showcase */}
      <section id="kesfet" className="relative py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="fade-in-up text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Neden MACRO?</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Teknoloji Yolculuğunuz
                </span>
                <br />
                Burada Başlıyor
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Hayallerinizdeki projeleri gerçeğe dönüştürün, sektör profesyonelleriyle tanışın, kariyerinize yön verin.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Code,
                  title: 'Yazılım & AI',
                  desc: 'Web development, mobile apps, machine learning ve data science projeleriyle deneyim kazanın.',
                  features: ['Full-Stack Development', 'AI/ML Projects', 'Mobile Apps', 'Cloud Computing'],
                  gradient: 'from-blue-500 to-cyan-500',
                  iconBg: 'bg-blue-500'
                },
                {
                  icon: Wrench,
                  title: 'Makine Tasarımı',
                  desc: 'CAD/CAM, 3D modelleme, üretim teknolojileri ve mekanik sistem tasarımı.',
                  features: ['SolidWorks/AutoCAD', '3D Printing', 'CNC Programlama', 'Simülasyon'],
                  gradient: 'from-purple-500 to-pink-500',
                  iconBg: 'bg-purple-500'
                },
                {
                  icon: Plane,
                  title: 'Havacılık & Drone',
                  desc: 'İHA sistemleri, uçak mühendisliği, aviyonik ve aerospace teknolojileri.',
                  features: ['Drone Development', 'Flight Control', 'Aerodinamik', 'Aviyonik'],
                  gradient: 'from-pink-500 to-red-500',
                  iconBg: 'bg-pink-500'
                },
                {
                  icon: Bot,
                  title: 'Robotik & Otonom',
                  desc: 'Robot tasarımı, otonom sistemler, sensör entegrasyonu ve kontrol algoritmaları.',
                  features: ['ROS', 'Computer Vision', 'Sensor Fusion', 'Path Planning'],
                  gradient: 'from-cyan-500 to-blue-500',
                  iconBg: 'bg-cyan-500'
                },
                {
                  icon: Zap,
                  title: 'Otomasyon',
                  desc: 'Endüstriyel otomasyon, PLC programlama, SCADA sistemleri ve IoT.',
                  features: ['PLC Programming', 'SCADA', 'IoT Systems', 'Industry 4.0'],
                  gradient: 'from-orange-500 to-yellow-500',
                  iconBg: 'bg-orange-500'
                },
                {
                  icon: Users,
                  title: 'Networking',
                  desc: 'Sektör profesyonelleri, mezunlar ve şirketlerle tanışma fırsatları.',
                  features: ['Mentorship', 'Career Talks', 'Company Visits', 'Alumni Network'],
                  gradient: 'from-green-500 to-emerald-500',
                  iconBg: 'bg-green-500'
                }
              ].map((feature, i) => (
                <div 
                  key={i}
                  className="fade-in-up group relative"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="relative h-full p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden">
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    {/* Content */}
                    <div className="relative">
                      {/* Icon */}
                      <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground mb-6">{feature.desc}</p>

                      {/* Features List */}
                      <ul className="space-y-2">
                        {feature.features.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.gradient}`} />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Hover effect corner */}
                    <div className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br ${feature.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="relative py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="fade-in-up text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Öğrenme <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Yolculuğunuz</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Başlangıçtan profesyonel seviyeye kadar rehberlik
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: BookOpen,
                  title: 'Temel Eğitimler',
                  level: 'Beginner',
                  desc: 'Sıfırdan başlayanlar için kapsamlı eğitim programları',
                  color: 'green'
                },
                {
                  icon: Lightbulb,
                  title: 'Proje Geliştirme',
                  level: 'Intermediate',
                  desc: 'Gerçek dünya projeleriyle pratik deneyim',
                  color: 'blue'
                },
                {
                  icon: Trophy,
                  title: 'Yarışmalar',
                  level: 'Advanced',
                  desc: 'Ulusal ve uluslararası teknoloji yarışmaları',
                  color: 'purple'
                }
              ].map((path, i) => (
                <div key={i} className="zoom-in group">
                  <div className="relative h-full p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl overflow-hidden">
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-${path.color}-500/10 border border-${path.color}-500/20`}>
                      <span className={`text-xs font-bold text-${path.color}-600 dark:text-${path.color}-400`}>{path.level}</span>
                    </div>
                    
                    <div className={`w-20 h-20 mb-6 rounded-2xl bg-${path.color}-500/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <path.icon className={`w-10 h-10 text-${path.color}-600 dark:text-${path.color}-400`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3">{path.title}</h3>
                    <p className="text-muted-foreground">{path.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="hakkinda" className="fade-in-up relative py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-3xl border bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm shadow-2xl overflow-hidden">
              <div className="flex items-center gap-4 border-b bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 px-10 py-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Info className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-black">Hakkımızda</h3>
                  <p className="text-sm text-muted-foreground">MACRO Teknoloji Topluluğu</p>
                </div>
              </div>
              <div className="p-10">
                {about ? (
                  <div className="space-y-8">
                    {about.title && (
                      <h3 className="text-3xl font-bold">{about.title}</h3>
                    )}
                    {about.image_url && (
                      <div className="relative w-full aspect-video overflow-hidden rounded-2xl border shadow-xl group">
                        <img 
                          src={about.image_url} 
                          alt={about.title || "Hakkımızda"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                    <SanitizedContent 
                      content={about.content}
                      className="prose prose-lg prose-slate dark:prose-invert max-w-none"
                    />
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Globe className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">Henüz içerik eklenmemiş.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section id="duyurular" className="fade-in-up relative py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-3xl border bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm shadow-2xl overflow-hidden">
              <div className="flex items-center gap-4 border-b bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-10 py-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Megaphone className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-black">Duyurular</h3>
                  <p className="text-sm text-muted-foreground">Güncel haberler ve duyurular</p>
                </div>
              </div>
              <div className="divide-y">
                {announcements.length === 0 ? (
                  <div className="text-center py-20">
                    <Megaphone className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">Henüz duyuru bulunmuyor.</p>
                  </div>
                ) : (
                  announcements.map((announcement, i) => (
                    <div 
                      key={announcement.id} 
                      className="p-10 hover:bg-muted/30 transition-all group"
                    >
                      <div className="flex flex-col lg:flex-row gap-8">
                        {announcement.image_url && (
                          <div className="lg:w-64 lg:flex-shrink-0">
                            <div className="relative w-full aspect-video lg:aspect-square overflow-hidden rounded-2xl border shadow-lg">
                              <img 
                                src={announcement.image_url} 
                                alt={announcement.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <h4 className="text-2xl font-bold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {announcement.title}
                            </h4>
                            <span className="text-sm text-muted-foreground whitespace-nowrap bg-muted px-4 py-2 rounded-full font-medium">
                              {new Date(announcement.created_at).toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                          <SanitizedContent 
                            content={announcement.content}
                            className="prose prose-slate dark:prose-invert max-w-none mb-6"
                          />
                          {announcement.link && (
                            <a 
                              href={announcement.link}
                              onClick={() => trackClick({ 
                                buttonName: 'announcement_link', 
                                section: 'announcement', 
                                page: 'home',
                                additionalData: {
                                  announcement_id: announcement.id,
                                  announcement_title: announcement.title
                                }
                              })}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:scale-105 hover:shadow-lg transition-all group/link"
                            >
                              <span>Detayları Gör</span>
                              <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="etkinlikler" className="fade-in-up relative py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-3xl border bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm shadow-2xl overflow-hidden">
              <div className="flex items-center gap-4 border-b bg-gradient-to-r from-pink-500/10 to-red-500/10 px-10 py-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-black">Yaklaşan Etkinlikler</h3>
                  <p className="text-sm text-muted-foreground">Workshoplar, seminerler ve daha fazlası</p>
                </div>
              </div>
              <div className="divide-y">
                {events.length === 0 ? (
                  <div className="text-center py-20">
                    <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">Henüz etkinlik bulunmuyor.</p>
                  </div>
                ) : (
                  events.map((event, i) => (
                    <div 
                      key={event.id} 
                      className="p-10 hover:bg-muted/30 transition-all group"
                    >
                      <div className="flex flex-col lg:flex-row gap-8">
                        {event.image_url && (
                          <div className="lg:w-64 lg:flex-shrink-0">
                            <div className="relative w-full aspect-video lg:aspect-square overflow-hidden rounded-2xl border shadow-lg">
                              <img 
                                src={event.image_url} 
                                alt={event.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <h4 className="text-2xl font-bold group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                              {event.title}
                            </h4>
                            {event.date && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap bg-muted px-4 py-2 rounded-full font-medium">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(event.date).toLocaleDateString('tr-TR')}</span>
                              </div>
                            )}
                          </div>
                          {event.description && (
                            <SanitizedContent 
                              content={event.description}
                              className="prose prose-slate dark:prose-invert max-w-none mb-6"
                            />
                          )}
                          {event.link && (
                            <a 
                              href={event.link}
                              onClick={() => trackClick({
                                buttonName: 'event_registration',
                                section: 'events',
                                page: 'home',
                                additionalData: {
                                  event_id: event.id,
                                  event_title: event.title,
                                  event_date: event.date
                                }
                              })}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-red-600 text-white font-semibold rounded-full hover:scale-105 hover:shadow-lg transition-all group/link"
                            >
                              <span>Detkinliğe Katıl</span>
                              <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-gradient-to-b from-background to-muted/50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-[150px]" />
        </div>
        
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Hemen Başlayın
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              MACRO ailesine katılın ve teknoloji yolculuğunuza bugün başlayın
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href="/kayit-ol"
                className="group px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-lg font-bold rounded-full hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 transition-all"
              >
                <span className="flex items-center gap-3">
                  Üye Ol
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </a>
              <a 
                href="#hakkinda"
                className="px-12 py-6 bg-background border-2 border-primary/30 text-foreground text-lg font-bold rounded-full hover:bg-primary/10 hover:border-primary/60 hover:scale-110 transition-all"
              >
                Daha Fazla Bilgi
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}