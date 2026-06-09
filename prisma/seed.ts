import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, ServiceGroup } from '../src/generated/prisma/client';
import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set.');
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const pool = new Pool({ connectionString: DATABASE_URL });
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const AMENITIES: { slug: string; description: string }[] = [
  {
    slug: 'spacious',
    description:
      'Large, open spaces that provide ample room for activities and movement.',
  },
  {
    slug: 'well-ventilated',
    description:
      'Proper airflow and ventilation systems ensuring fresh air throughout the facility.',
  },
  {
    slug: 'age-appropriate-spaces',
    description:
      'Dedicated zones designed and equipped for different age groups.',
  },
  {
    slug: 'sports-&-fitness-equipment',
    description:
      'A wide range of modern sports and fitness equipment for training and exercise.',
  },
  {
    slug: 'musical-instruments',
    description:
      'A variety of musical instruments available for practice and learning.',
  },
  {
    slug: 'cctv-surveillance',
    description:
      'Round-the-clock CCTV monitoring for the safety and security of all participants.',
  },
  {
    slug: 'trained-staff-&-instructors',
    description:
      'Certified and experienced staff and instructors to guide and support learners.',
  },
  {
    slug: 'security-guards',
    description:
      'On-site security personnel to ensure a safe environment at all times.',
  },
  {
    slug: 'first-aid',
    description:
      'First aid kits and trained personnel available to handle minor medical emergencies.',
  },
  {
    slug: 'medical-assistance',
    description:
      'Access to medical assistance or a resident nurse for health-related needs.',
  },
  {
    slug: 'clean-restrooms',
    description:
      'Well-maintained and hygienic restroom facilities for all visitors.',
  },
  {
    slug: 'cafeteria',
    description:
      'On-site cafeteria providing healthy snacks and meals for students and staff.',
  },
  {
    slug: 'parking',
    description: 'Designated and secure parking space for vehicles.',
  },
  {
    slug: 'transportation',
    description:
      'Convenient transportation services or proximity to public transit.',
  },
  {
    slug: 'child-friendly',
    description:
      'Facilities and environment specially designed to be safe and welcoming for children.',
  },
  {
    slug: 'parent-friendly',
    description:
      'Comfortable waiting and observation areas for parents and guardians.',
  },
  {
    slug: 'eco-friendly',
    description:
      'Environmentally sustainable practices and green infrastructure in place.',
  },
  {
    slug: 'wheelchair-accessible',
    description:
      'Ramps, lifts, and accessible pathways for individuals with mobility challenges.',
  },
  {
    slug: 'hygiene',
    description:
      'High standards of cleanliness and hygiene maintained across all areas.',
  },
  {
    slug: 'fire-safety',
    description:
      'Fire extinguishers, smoke detectors, and safety protocols to handle fire emergencies.',
  },
  {
    slug: 'emergency-exit',
    description:
      'Clearly marked and unobstructed emergency exits for quick evacuation.',
  },
  {
    slug: 'library',
    description:
      'A well-stocked library with books and resources for learning and research.',
  },
  {
    slug: 'play-area',
    description: 'A dedicated and safe play area for recreational activities.',
  },
  {
    slug: 'activity-area',
    description:
      'Versatile activity zones set up for structured and creative activities.',
  },
  {
    slug: 'sports-area',
    description:
      'Designated outdoor or indoor area for practising various sports.',
  },
  {
    slug: 'dance-studio',
    description:
      'A professionally equipped studio with mirrors and flooring for dance practice.',
  },
  {
    slug: 'music-room',
    description:
      'A soundproofed room furnished with instruments and audio equipment for music sessions.',
  },
  {
    slug: 'art-room',
    description:
      'A creative workspace stocked with art supplies and tools for visual arts.',
  },
  {
    slug: 'science-lab',
    description:
      'A fully equipped laboratory for hands-on scientific experiments and exploration.',
  },
  {
    slug: 'computer-lab',
    description:
      'A computer lab with up-to-date systems and internet access for digital learning.',
  },
  {
    slug: 'audio-visual-room',
    description:
      'A dedicated room with projectors and audio equipment for presentations and screenings.',
  },
  {
    slug: 'smart-classrooms',
    description:
      'Technologically advanced classrooms with interactive boards and digital tools.',
  },
  {
    slug: 'open-air-theatre',
    description:
      'An outdoor performance space for events, shows, and cultural activities.',
  },
  {
    slug: 'auditorium',
    description:
      'A large indoor hall for assemblies, performances, and events.',
  },
  {
    slug: 'stage',
    description:
      'A dedicated performance stage for presentations, plays, and cultural events.',
  },
  {
    slug: 'greenery',
    description:
      'Lush green surroundings that provide a pleasant and refreshing environment.',
  },
  {
    slug: 'garden',
    description:
      'A well-maintained garden offering a calm, natural outdoor space.',
  },
  {
    slug: 'outdoor-play-area',
    description:
      'Open outdoor space equipped for physical games and recreational activities.',
  },
  {
    slug: 'indoor-play-area',
    description:
      'An enclosed, weather-proof space for indoor games and activities.',
  },
  {
    slug: 'swimming-pool',
    description:
      'A clean and supervised swimming pool for aquatic training and recreation.',
  },
  {
    slug: 'gym',
    description:
      'A fully equipped gymnasium with modern fitness machines and free weights.',
  },
  {
    slug: 'yoga-room',
    description:
      'A calm and spacious room dedicated to yoga practice and mindfulness exercises.',
  },
  {
    slug: 'meditation-room',
    description:
      'A quiet, serene space designed for meditation and relaxation sessions.',
  },
  {
    slug: 'changing-rooms',
    description:
      'Clean and private changing rooms available for all participants.',
  },
  {
    slug: 'locker-facility',
    description:
      'Secure lockers available for storing personal belongings during sessions.',
  },
  {
    slug: 'water-cooler',
    description:
      'Access to clean drinking water through water coolers placed across the facility.',
  },
];

const SERVICES: Record<string, { name: string; description: string }[]> = {
  'Sports and Physical Activities': [
    {
      name: 'Archery',
      description:
        'Learn the art of archery with professional coaching, focusing on precision, focus, and technique.',
    },
    {
      name: 'Badminton',
      description:
        'Develop agility, speed, and racket skills through structured badminton training sessions.',
    },
    {
      name: 'Basketball',
      description:
        'Build teamwork and athletic skills through coached basketball drills and match practice.',
    },
    {
      name: 'Boxing',
      description:
        'Learn fundamental boxing techniques including stance, footwork, and combinations under expert guidance.',
    },
    {
      name: 'Cricket',
      description:
        'Master batting, bowling, and fielding through professional cricket coaching for all skill levels.',
    },
    {
      name: 'Football',
      description:
        'Develop dribbling, passing, and tactical skills through structured football training programmes.',
    },
    {
      name: 'Golf',
      description:
        'Refine your swing and course strategy with personalised golf coaching for beginners and enthusiasts.',
    },
    {
      name: 'Gymnastics',
      description:
        'Build flexibility, strength, and coordination through guided gymnastics training and floor routines.',
    },
    {
      name: 'Horse Riding',
      description:
        'Learn equestrian skills including posture, control, and riding techniques under certified instructors.',
    },
    {
      name: 'Martial Arts',
      description:
        'Gain self-defence skills and discipline through structured martial arts training across various styles.',
    },
    {
      name: 'Shooting',
      description:
        'Develop aim, focus, and safety awareness through professional shooting range coaching.',
    },
    {
      name: 'Skating',
      description:
        'Learn balance and skating techniques from scratch or refine advanced skills on a proper rink.',
    },
    {
      name: 'Swimming',
      description:
        'Master all major swim strokes and water safety skills under certified swimming coaches.',
    },
    {
      name: 'Lawn Tennis',
      description:
        'Improve your serve, volley, and court strategy with expert lawn tennis coaching.',
    },
    {
      name: 'Squash',
      description:
        'Enhance speed, reflexes, and racket skills through competitive squash training sessions.',
    },
    {
      name: 'Wrestling',
      description:
        'Learn grappling, holds, and takedown techniques through professionally supervised wrestling training.',
    },
    {
      name: 'Chess',
      description:
        'Sharpen strategic thinking and problem-solving skills through structured chess coaching and tournaments.',
    },
    {
      name: 'Taekwondo',
      description:
        'Learn kicking techniques, forms, and sparring under certified Taekwondo instructors.',
    },
  ],
  'Dance and Fitness': [
    {
      name: 'Ballet',
      description:
        'Develop grace, posture, and classical technique through structured ballet training for all ages.',
    },
    {
      name: 'Kathak',
      description:
        'Learn rhythmic footwork, expressive gestures, and spins of the classical Indian Kathak dance form.',
    },
    {
      name: 'Bharatnatyam',
      description:
        'Explore the ancient classical dance form of Bharatnatyam, focusing on expressions, rhythm, and posture.',
    },
    {
      name: 'Western Dance',
      description:
        'Train in popular Western dance styles including hip-hop, jazz, and freestyle under expert choreographers.',
    },
    {
      name: 'Bollywood',
      description:
        'Learn vibrant Bollywood dance moves and choreography inspired by Indian cinema.',
    },
    {
      name: 'Zumba',
      description:
        'Enjoy a fun, high-energy fitness dance workout combining Latin and international music and movements.',
    },
    {
      name: 'Yoga',
      description:
        'Improve flexibility, strength, and mental wellness through guided yoga sessions for all levels.',
    },
  ],
  'Music and Performing Arts': [
    {
      name: 'Drums',
      description:
        'Build rhythm and coordination by learning drum techniques from basic beats to advanced patterns.',
    },
    {
      name: 'Flute',
      description:
        'Develop breath control and musical expression through personalised flute lessons.',
    },
    {
      name: 'Guitar',
      description:
        'Learn chords, scales, and music theory through structured acoustic or electric guitar training.',
    },
    {
      name: 'Piano',
      description:
        'Master the piano from foundational scales to complex compositions under skilled instructors.',
    },
    {
      name: 'Singing',
      description:
        'Develop vocal technique, breath control, and musical performance skills through individual or group singing lessons.',
    },
    {
      name: 'Tabla',
      description:
        'Learn the traditional Indian percussion instrument Tabla with guidance on rhythmic patterns and compositions.',
    },
    {
      name: 'Violin',
      description:
        'Build bowing technique, posture, and musical expression through structured violin training.',
    },
    {
      name: 'Theatre',
      description:
        'Explore acting, improvisation, and stagecraft through immersive theatre and drama workshops.',
    },
  ],
  'Art and Creativity': [
    {
      name: 'Art',
      description:
        'Explore drawing, painting, and mixed media techniques through guided art sessions for all skill levels.',
    },
    {
      name: 'Crafts',
      description:
        'Develop creativity and fine motor skills through a variety of hands-on craft-making activities.',
    },
    {
      name: 'Pottery',
      description:
        'Learn the ancient art of pottery, including hand-building and wheel-throwing techniques.',
    },
    {
      name: 'Photography',
      description:
        'Master composition, lighting, and editing through practical photography workshops and field sessions.',
    },
  ],
  'Academic and Skill Development': [
    {
      name: 'German',
      description:
        'Build conversational and written proficiency in German through structured language courses.',
    },
    {
      name: 'Spanish',
      description:
        'Learn spoken and written Spanish with interactive lessons designed for beginners to advanced learners.',
    },
    {
      name: 'Japanese',
      description:
        'Develop Japanese language skills including Hiragana, Katakana, and conversational ability.',
    },
    {
      name: 'English',
      description:
        'Strengthen reading, writing, speaking, and comprehension skills in English through focused coaching.',
    },
    {
      name: 'Public Speaking',
      description:
        'Overcome stage fear and develop confident, impactful communication skills through regular practice.',
    },
    {
      name: 'Book Reading',
      description:
        'Cultivate a reading habit and critical thinking through curated book clubs and reading sessions.',
    },
    {
      name: 'Personality Development',
      description:
        'Build confidence, communication, and interpersonal skills through interactive personality development workshops.',
    },
    {
      name: 'Robotics',
      description:
        'Learn coding, electronics, and problem-solving by designing and building robots under expert mentors.',
    },
  ],
};

const SERVICE_GROUP_MAP: Record<string, ServiceGroup> = {
  'Sports and Physical Activities': ServiceGroup.sports_and_physical_activities,
  'Dance and Fitness': ServiceGroup.dance_and_fitness,
  'Music and Performing Arts': ServiceGroup.music_and_performing_arts,
  'Art and Creativity': ServiceGroup.art_and_creativity,
  'Academic and Skill Development': ServiceGroup.academic_and_skill_development,
};

function toTitleCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function seedSuperAdmin(): Promise<number> {
  const admin = await prisma.appAdminStaff.upsert({
    where: { phoneNumber: '9999999999' },
    update: {},
    create: {
      fullName: 'Super Admin',
      email: 'superadmin@kreo.world',
      phoneNumber: '9999999999',
      role: 'super_admin',
      isActive: true,
    },
  });

  console.log(`Super admin seeded with id: ${admin.id}`);
  return admin.id;
}

async function seedAmenities(createdBy: number) {
  for (const amenity of AMENITIES) {
    const amenityName = toTitleCase(amenity.slug);
    await prisma.ameneties.upsert({
      where: { amenityName },
      update: { description: amenity.description },
      create: {
        amenityName,
        description: amenity.description,
        createdBy,
      },
    });
  }

  console.log(`Seeded ${AMENITIES.length} amenities`);
}

async function seedServices(createdBy: number) {
  let count = 0;

  for (const [group, services] of Object.entries(SERVICES)) {
    const serviceGroup = SERVICE_GROUP_MAP[group];

    for (const service of services) {
      await prisma.services.upsert({
        where: { serviceName: service.name },
        update: { description: service.description },
        create: {
          serviceName: service.name,
          serviceGroup,
          description: service.description,
          createdBy: BigInt(createdBy),
        },
      });
      count++;
    }
  }

  console.log(`Seeded ${count} services`);
}

async function main() {
  console.log('Seeding super admin...');
  const adminId = await seedSuperAdmin();

  console.log('Seeding amenities and services...');
  await seedAmenities(adminId);
  await seedServices(adminId);

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
