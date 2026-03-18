import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data in correct order to avoid FK violations
  console.log('Clearing existing data...');
  await prisma.certificate?.deleteMany().catch(() => {}); // Safety if table hasn't been pushed yet
  await prisma.refreshToken.deleteMany();
  await prisma.videoProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.video.deleteMany();
  await prisma.section.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.user.deleteMany();

  // Create Sample User
  console.log('Creating sample user...');
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'prajju@example.com',
      passwordHash,
      name: 'Prajwal S',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prajwal'
    }
  });

  const subjects = [
    {
      title: 'Modern Web Development',
      slug: 'web-dev-basics',
      description: 'Master the fundamentals of modern web development with HTML5, CSS3, and JavaScript ES6+.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
      category: 'Development',
      difficultyLevel: 'BASIC',
      isPublished: true,
      sections: [
        {
          title: 'HTML5 & Semantic Web',
          orderIndex: 1,
          videos: [
            { title: 'Introduction to HTML5', youtubeId: 'pQN-pnXPaVg', orderIndex: 1, durationSeconds: 600 },
            { title: 'Semantic Tags & Accessibility', youtubeId: 'K_9v47O-Y5w', orderIndex: 2, durationSeconds: 900 }
          ]
        },
        {
          title: 'CSS3 Styling & Flexbox',
          orderIndex: 2,
          videos: [
            { title: 'CSS Fundamentals', youtubeId: '1PnVor36_40', orderIndex: 1, durationSeconds: 850 },
            { title: 'Flexbox Layout Design', youtubeId: 'fYq5PXgSsbE', orderIndex: 2, durationSeconds: 1200 }
          ]
        }
      ]
    },
    {
      title: 'Python for Data Science',
      slug: 'python-basics',
      description: 'Go from zero to hero in Python. Learn data analysis, visualization, and automation.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
      category: 'Development',
      difficultyLevel: 'INTERMEDIATE',
      isPublished: true,
      sections: [
        {
          title: 'Python Core Concepts',
          orderIndex: 1,
          videos: [
            { title: 'Variables, Lists & Dictionaries', youtubeId: 'rfscVS0vtbw', orderIndex: 1, durationSeconds: 700 },
            { title: 'Control Flow & Functions', youtubeId: '8DvywoWv6fI', orderIndex: 2, durationSeconds: 950 }
          ]
        },
        {
          title: 'Data Analysis with Pandas',
          orderIndex: 2,
          videos: [
            { title: 'Intro to Pandas DataFrames', youtubeId: 'vmEHCJofslg', orderIndex: 1, durationSeconds: 1100 }
          ]
        }
      ]
    },
    {
      title: 'Mastering UI/UX Design',
      slug: 'ui-ux-design',
      description: 'Learn the secrets of professional digital product design using Figma and user research.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800',
      category: 'Design',
      difficultyLevel: 'BASIC',
      isPublished: true,
      sections: [
        {
          title: 'Design Foundations',
          orderIndex: 1,
          videos: [
            { title: 'The UX Research Process', youtubeId: 'ovNreG_8w38', orderIndex: 1, durationSeconds: 900 },
            { title: 'Visual Hierarchy & Grid Systems', youtubeId: 't6-f28mRj8Y', orderIndex: 2, durationSeconds: 750 }
          ]
        }
      ]
    },
    {
      title: 'Full-Stack Digital Marketing',
      slug: 'digital-marketing',
      description: 'Comprehensive guide to SEO, PPC, and Content Strategy to grow any business.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      category: 'Marketing',
      difficultyLevel: 'BASIC',
      isPublished: true,
      sections: [
        {
          title: 'Search Engine Optimization',
          orderIndex: 1,
          videos: [
            { title: 'On-Page SEO Mastery', youtubeId: 'DvwS7cV9GmQ', orderIndex: 1, durationSeconds: 800 },
            { title: 'Backlink Strategies', youtubeId: '6338V0s8Lmk', orderIndex: 2, durationSeconds: 1050 }
          ]
        }
      ]
    },
    {
      title: 'Deep Learning & Neural Networks',
      slug: 'adv-ml',
      description: 'Advanced course on deep learning, transformer models, and AI deployment.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
      category: 'Data Science',
      difficultyLevel: 'ADVANCED',
      isPublished: true,
      sections: [
        {
          title: 'Neural Network Architecture',
          orderIndex: 1,
          videos: [
            { title: 'Backpropagation Explained', youtubeId: 'aircAruvnKk', orderIndex: 1, durationSeconds: 1200 },
            { title: 'Convolutional Neural Networks (CNN)', youtubeId: 'YRhxdVk_sIs', orderIndex: 2, durationSeconds: 1350 }
          ]
        }
      ]
    },
    {
      title: 'Cybersecurity: Ethical Hacking',
      slug: 'ethical-hacking',
      description: 'Professional penetration testing and ethical hacking techniques for network security.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      category: 'Cybersecurity',
      difficultyLevel: 'INTERMEDIATE',
      isPublished: true,
      sections: [
        {
          title: 'Penetration Testing Phases',
          orderIndex: 1,
          videos: [
            { title: 'Reconnaissance & Footprinting', youtubeId: '3Kq1MIfTWCE', orderIndex: 1, durationSeconds: 1100 },
            { title: 'Exploitation Techniques', youtubeId: '9G-vD0G3Q-g', orderIndex: 2, durationSeconds: 1400 }
          ]
        }
      ]
    },
    {
      title: 'SwiftUI: Premium iOS Apps',
      slug: 'ios-dev',
      description: 'Build native iOS applications with a focus on premium animations and performance.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800',
      category: 'Mobile',
      difficultyLevel: 'INTERMEDIATE',
      isPublished: true,
      sections: [
        {
          title: 'SwiftUI Advanced Layouts',
          orderIndex: 1,
          videos: [
            { title: 'Animations & State Management', youtubeId: 'UlpfG734PPw', orderIndex: 1, durationSeconds: 1500 },
            { title: 'Native API Integration', youtubeId: 'v8v_H0YgAn8', orderIndex: 2, durationSeconds: 1300 }
          ]
        }
      ]
    },
    {
      title: 'Financial Strategy & Investing',
      slug: 'finance-basics',
      description: 'Master the stock market, crypto, and traditional investing for long-term wealth.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611974717483-36030cc7897c?auto=format&fit=crop&q=80&w=800',
      category: 'Finance',
      difficultyLevel: 'BASIC',
      isPublished: true,
      sections: [
        {
          title: 'Investment Fundamentals',
          orderIndex: 1,
          videos: [
            { title: 'Stock Market 101', youtubeId: '7e_88E6uW_w', orderIndex: 1, durationSeconds: 600 },
            { title: 'Crypto & DeFi Basics', youtubeId: 'gx_6_6uQ9zY', orderIndex: 2, durationSeconds: 1100 }
          ]
        }
      ]
    },
    {
      title: 'Public Speaking Mastery',
      slug: 'public-speaking',
      description: 'Conquer your stage fright and deliver speeches that captivate and persuade any audience.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1475721027185-39a12e7d0011?auto=format&fit=crop&q=80&w=800',
      category: 'Soft Skills',
      difficultyLevel: 'BASIC',
      isPublished: true,
      sections: [
        {
          title: 'Captivating Your Audience',
          orderIndex: 1,
          videos: [
            { title: 'The Art of Storytelling', youtubeId: 'pS-Wp4C0-8E', orderIndex: 1, durationSeconds: 950 },
            { title: 'Stage Presence & Body Language', youtubeId: 'WzP9G-wB1Ew', orderIndex: 2, durationSeconds: 850 }
          ]
        }
      ]
    },
    {
      title: 'AI Engineering with LLMs',
      slug: 'ai-engineering',
      description: 'Build production-ready AI applications using OpenAI, LangChain, and Vector Databases.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
      category: 'Artificial Intelligence',
      difficultyLevel: 'ADVANCED',
      isPublished: true,
      sections: [
        {
          title: 'Foundations of LLMs',
          orderIndex: 1,
          videos: [
            { title: 'Prompt Engineering Masterclass', youtubeId: 'jC4v5AS4RIM', orderIndex: 1, durationSeconds: 1200 },
            { title: 'Building with LangChain', youtubeId: 'lG7Uxts9SXs', orderIndex: 2, durationSeconds: 1500 }
          ]
        }
      ]
    },
    {
      title: 'Cloud Architecture: AWS & Azure',
      slug: 'cloud-architecture',
      description: 'Design scalable, resilient cloud infrastructure on major platforms like AWS and Azure.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
      category: 'Cloud Computing',
      difficultyLevel: 'INTERMEDIATE',
      isPublished: true,
      sections: [
        {
          title: 'Cloud Fundamentals',
          orderIndex: 1,
          videos: [
            { title: 'Introduction to AWS Services', youtubeId: 'Z3SYDTn3shE', orderIndex: 1, durationSeconds: 1100 },
            { title: 'Serverless Architecture with Lambda', youtubeId: 'EBSfbM7P_m8', orderIndex: 2, durationSeconds: 1300 }
          ]
        }
      ]
    },
    {
      title: 'Modern Photography Mastery',
      slug: 'photography-mastery',
      description: 'Capture stunning visuals. From camera basics to professional editing in Lightroom.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244733e?auto=format&fit=crop&q=80&w=800',
      category: 'Creative Arts',
      difficultyLevel: 'BASIC',
      isPublished: true,
      sections: [
        {
          title: 'Camera Essentials',
          orderIndex: 1,
          videos: [
            { title: 'Understanding Exposure Triangle', youtubeId: '3eL8nc_OayU', orderIndex: 1, durationSeconds: 900 },
            { title: 'Composition Techniques', youtubeId: 'VArISvUuyr0', orderIndex: 2, durationSeconds: 1050 }
          ]
        }
      ]
    },
    {
      title: 'Entrepreneurship: Launching a Startup',
      slug: 'entrepreneurship-startup',
      description: 'From idea to exit. Learn how to validate, fund, and scale your business from scratch.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
      category: 'Business',
      difficultyLevel: 'BASIC',
      isPublished: true,
      sections: [
        {
          title: 'Startup Foundations',
          orderIndex: 1,
          videos: [
            { title: 'Market Research & Validation', youtubeId: '8p_28rYIDRk', orderIndex: 1, durationSeconds: 1200 },
            { title: 'The Lean Startup Methodology', youtubeId: 'fEvKo90qBns', orderIndex: 2, durationSeconds: 1400 }
          ]
        }
      ]
    },
    {
      title: 'Game Development with Unity',
      slug: 'game-dev-unity',
      description: 'Create immersive 3D games with Unity and C#. Learn physics, AI, and level design.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1552824236-fa982367c35a?auto=format&fit=crop&q=80&w=800',
      category: 'Game Development',
      difficultyLevel: 'INTERMEDIATE',
      isPublished: true,
      sections: [
        {
          title: 'Unity Basics',
          orderIndex: 1,
          videos: [
            { title: 'Introduction to Unity Editor', youtubeId: 'gB1F9G0JXOo', orderIndex: 1, durationSeconds: 1100 },
            { title: 'C# Scripting for Games', youtubeId: 'j48Lt_76zr8', orderIndex: 2, durationSeconds: 1350 }
          ]
        }
      ]
    },
    {
      title: 'Advanced React Patterns',
      slug: 'advanced-react',
      description: 'Deep dive into performance optimization, custom hooks, and large-scale state management.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
      category: 'Development',
      difficultyLevel: 'ADVANCED',
      isPublished: true,
      sections: [
        {
          title: 'React Performance',
          orderIndex: 1,
          videos: [
            { title: 'Memoization & Rendering Optimization', youtubeId: 'DP3pGjV_yvE', orderIndex: 1, durationSeconds: 1500 },
            { title: 'Advanced Hook Patterns', youtubeId: 'O6P86uwfdO0', orderIndex: 2, durationSeconds: 1400 }
          ]
        }
      ]
    }
  ];


  console.log('Creating courses and sections...');
  for (const s of subjects) {
    const subject = await prisma.subject.create({
      data: {
        title: s.title,
        slug: s.slug,
        description: s.description,
        thumbnailUrl: s.thumbnailUrl,
        category: s.category,
        difficultyLevel: s.difficultyLevel as any,
        isPublished: s.isPublished,
      }
    });


    for (const sec of s.sections) {
      const section = await prisma.section.create({
        data: {
          title: sec.title,
          orderIndex: sec.orderIndex,
          subjectId: subject.id
        }
      });

      for (const vid of sec.videos) {
        await prisma.video.create({
          data: {
            title: vid.title,
            youtubeId: vid.youtubeId,
            orderIndex: vid.orderIndex,
            durationSeconds: vid.durationSeconds,
            sectionId: section.id
          }
        });
      }
    }
  }

  console.log('Seed completed successfully with 15 courses!');
}

main()
  .catch((e) => {
    console.error(e);
    // @ts-ignore
    if (typeof process !== 'undefined') process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
